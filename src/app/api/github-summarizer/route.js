import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { summarizeGithubReadme, getReadmeContentFromGithub } from '../../../../lib/chain';

export async function POST(request) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Supabase environment variables are not configured'
        },
        { status: 500 }
      );
    }

    const { githubUrl } = await request.json();
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    console.log('Validating API key:', apiKey.substring(0, 8) + '...');

    // Query the database to check if the API key exists
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, value, usage, limit_usage, monthly_limit')
      .eq('value', apiKey);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Database error',
          details: error.message 
        },
        { status: 500 }
      );
    }

    // Check if we found exactly one API key
    if (!data || data.length === 0) {
      return NextResponse.json(
        { valid: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (data.length > 1) {
      console.error('Multiple API keys found with same value:', data);
      return NextResponse.json(
        { valid: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const apiKeyData = data[0];

    // Check if the API key has exceeded its monthly limit
    if (apiKeyData.limit_usage && apiKeyData.monthly_limit && apiKeyData.usage >= apiKeyData.monthly_limit) {
      return NextResponse.json(
        { valid: false, error: 'API key has exceeded monthly limit' },
        { status: 429 }
      );
    }
    // Validate GitHub URL is provided
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      );
    }

    // Fetch README content from GitHub
    const readmeContent = await getReadmeContentFromGithub(githubUrl);
    
    if (!readmeContent) {
      return NextResponse.json(
        { error: 'Could not fetch README.md from the provided GitHub repository' },
        { status: 404 }
      );
    }

    // Generate summary using LangChain
    const summary = await summarizeGithubReadme(readmeContent);

    // Increment API key usage AFTER successful processing
    try {
      const { data: currentData } = await supabase
        .from('api_keys')
        .select('usage')
        .eq('id', apiKeyData.id)
        .single();

      if (currentData) {
        await supabase
          .from('api_keys')
          .update({ 
            usage: (currentData.usage || 0) + 1
          })
          .eq('id', apiKeyData.id);
      }
    } catch (incrementError) {
      console.error('Error incrementing API key usage:', incrementError);
      // Don't fail the request if usage tracking fails, just log it
    }

    // Return success response with summary
    return NextResponse.json({
      summary: summary.summary,
      cool_facts: summary.cool_facts
    });

  } catch (error) {
    console.error('Error in GitHub summarizer endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
