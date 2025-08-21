using Projects;

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

IResourceBuilder<RabbitMQServerResource> coursemateRabbitMq = builder.AddRabbitMQ("coursemate-rabbitmq")
    .WithManagementPlugin();

IResourceBuilder<PostgresServerResource> coursemateDb = builder.AddPostgres("coursemate-db")
    .WithLifetime(ContainerLifetime.Persistent);

IResourceBuilder<ProjectResource> coursemateApi = builder.AddProject<CourseMate>("coursemate-api")
    .WaitFor(coursemateDb)
    .WithReference(coursemateDb)
    .WithReference(coursemateRabbitMq)
    .WithReference(coursemateRabbitMq)
    .WithHttpsEndpoint(44393);

builder.AddYarnApp("admin", "../admin")
    .WithReference(coursemateApi)
    .WaitFor(coursemateApi)
    .WithExternalHttpEndpoints()
    .WithHttpEndpoint(4200, isProxied: false);

builder.AddYarnApp("client", "../client")
    .WithReference(coursemateApi)
    .WaitFor(coursemateApi)
    .WithExternalHttpEndpoints()
    .WithHttpEndpoint(4100, isProxied: false);

builder.Build().Run();