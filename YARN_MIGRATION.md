# Migrating from npm to yarn

This guide will help you switch from npm to yarn for the DevKey Hub project.

## Prerequisites

Make sure you have yarn installed globally:

```bash
npm install -g yarn
```

## Migration Steps

### 1. Remove npm files

```bash
# Remove npm lock file and node_modules
rm package-lock.json
rm -rf node_modules
```

### 2. Install dependencies with yarn

```bash
# Install all dependencies using yarn
yarn install
```

### 3. Verify the installation

```bash
# Check if yarn.lock was created
ls -la yarn.lock

# Test the development server
yarn dev
```

## Yarn Commands

### Development
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
```

### Package Management
```bash
yarn add <package>           # Add a dependency
yarn add -D <package>        # Add a dev dependency
yarn remove <package>        # Remove a dependency
yarn upgrade <package>       # Upgrade a package
yarn upgrade-interactive     # Interactive upgrade
```

### Other Useful Commands
```bash
yarn cache clean             # Clean yarn cache
yarn why <package>           # Show why a package is installed
yarn list                    # List all installed packages
yarn outdated                # Check for outdated packages
```

## Benefits of Yarn

1. **Faster Installation**: Yarn is generally faster than npm
2. **Better Lock File**: yarn.lock is more reliable than package-lock.json
3. **Parallel Installation**: Yarn installs packages in parallel
4. **Offline Mode**: Yarn can work offline with cached packages
5. **Workspaces**: Better support for monorepos

## Troubleshooting

### If you encounter issues:

1. **Clear yarn cache**:
   ```bash
   yarn cache clean
   ```

2. **Delete yarn.lock and reinstall**:
   ```bash
   rm yarn.lock
   rm -rf node_modules
   yarn install
   ```

3. **Check yarn version**:
   ```bash
   yarn --version
   ```

### Common Issues:

- **Permission errors**: Use `sudo` for global installations
- **Cache issues**: Clear cache with `yarn cache clean`
- **Lock file conflicts**: Delete yarn.lock and reinstall

## Deployment

### Vercel
Vercel automatically detects yarn and uses it when yarn.lock is present.

### Other Platforms
Most deployment platforms (Netlify, Railway, etc.) automatically detect and use yarn.

## Team Migration

If you're working in a team:

1. **Commit yarn.lock** to version control
2. **Update CI/CD** pipelines to use yarn
3. **Update documentation** with yarn commands
4. **Inform team members** about the migration

## Rollback (if needed)

If you need to go back to npm:

```bash
rm yarn.lock
rm -rf node_modules
npm install
``` 