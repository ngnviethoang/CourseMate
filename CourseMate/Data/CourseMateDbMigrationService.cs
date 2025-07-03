﻿using System.Diagnostics;
using System.Runtime.InteropServices;
using Microsoft.Extensions.Logging.Abstractions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace CourseMate.Data;

public class CourseMateDbMigrationService : ITransientDependency
{
    private readonly ICurrentTenant _currentTenant;

    private readonly IDataSeeder _dataSeeder;
    private readonly CourseMateDbSchemaMigrator _dbSchemaMigrator;

    public CourseMateDbMigrationService(
        IDataSeeder dataSeeder,
        CourseMateDbSchemaMigrator dbSchemaMigrator,
        ICurrentTenant currentTenant)
    {
        _dataSeeder = dataSeeder;
        _dbSchemaMigrator = dbSchemaMigrator;
        _currentTenant = currentTenant;

        Logger = NullLogger<CourseMateDbMigrationService>.Instance;
    }

    public ILogger<CourseMateDbMigrationService> Logger { get; set; }

    public async Task MigrateAsync()
    {
        bool initialMigrationAdded = AddInitialMigrationIfNotExist();

        if (initialMigrationAdded)
        {
            return;
        }

        Logger.LogInformation("Started database migrations...");

        await MigrateDatabaseSchemaAsync();
        await SeedDataAsync();

        Logger.LogInformation("Successfully completed host database migrations.");
        Logger.LogInformation("You can safely end this process...");
    }

    private async Task MigrateDatabaseSchemaAsync()
    {
        await _dbSchemaMigrator.MigrateAsync();
    }

    private async Task SeedDataAsync()
    {
        await _dataSeeder.SeedAsync(new DataSeedContext()
            .WithProperty(IdentityDataSeedContributor.AdminEmailPropertyName, IdentityDataSeedContributor.AdminEmailDefaultValue)
            .WithProperty(IdentityDataSeedContributor.AdminPasswordPropertyName, IdentityDataSeedContributor.AdminPasswordDefaultValue)
        );
    }

    private bool AddInitialMigrationIfNotExist()
    {
        try
        {
            if (!DbMigrationsProjectExists())
            {
                return false;
            }
        }
        catch (Exception)
        {
            return false;
        }

        try
        {
            if (!MigrationsFolderExists())
            {
                AddInitialMigration();
                return true;
            }

            return false;
        }
        catch (Exception e)
        {
            Logger.LogWarning("Couldn't determinate if any migrations exist : " + e.Message);
            return false;
        }
    }

    private bool DbMigrationsProjectExists()
    {
        return Directory.Exists(GetEntityFrameworkCoreProjectFolderPath());
    }

    private bool MigrationsFolderExists()
    {
        string dbMigrationsProjectFolder = GetEntityFrameworkCoreProjectFolderPath();

        return Directory.Exists(Path.Combine(dbMigrationsProjectFolder, "Migrations"));
    }

    private void AddInitialMigration()
    {
        Logger.LogInformation("Creating initial migration...");

        string argumentPrefix;
        string fileName;

        if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX) || RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            argumentPrefix = "-c";
            fileName = "/bin/bash";
        }
        else
        {
            argumentPrefix = "/C";
            fileName = "cmd.exe";
        }

        ProcessStartInfo procStartInfo = new(fileName,
            $"{argumentPrefix} \"abp create-migration-and-run-migrator \"{GetEntityFrameworkCoreProjectFolderPath()}\" --nolayers\""
        );

        try
        {
            Process.Start(procStartInfo);
        }
        catch (Exception)
        {
            throw new Exception("Couldn't run ABP CLI...");
        }
    }

    private string GetEntityFrameworkCoreProjectFolderPath()
    {
        string? slnDirectoryPath = GetSolutionDirectoryPath();

        if (slnDirectoryPath == null)
        {
            throw new Exception("Solution folder not found!");
        }

        return Path.Combine(slnDirectoryPath, "CourseMate.Mvc");
    }

    private string GetSolutionDirectoryPath()
    {
        DirectoryInfo? currentDirectory = new(Directory.GetCurrentDirectory());

        while (Directory.GetParent(currentDirectory.FullName) != null)
        {
            currentDirectory = Directory.GetParent(currentDirectory.FullName);

            if (Directory.GetFiles(currentDirectory.FullName).FirstOrDefault(f => f.EndsWith(".sln")) != null)
            {
                return currentDirectory.FullName;
            }
        }

        return null;
    }
}