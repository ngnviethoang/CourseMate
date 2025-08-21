IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

IResourceBuilder<PostgresServerResource> coursemateDb = builder.AddPostgres("coursemate-db")
    .WithLifetime(ContainerLifetime.Persistent);

IResourceBuilder<RabbitMQServerResource> coursemateRabbitMq = builder.AddRabbitMQ("coursemate-rabbitmq");

IResourceBuilder<ProjectResource> coursemateApi = builder.AddProject<Projects.CourseMate>("coursemate-api")
    .WaitFor(coursemateDb)
    .WaitFor(coursemateRabbitMq);

builder.AddNodeApp("admin", "../admin")
    .WaitFor(coursemateApi)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddNodeApp("client", "../client")
    .WaitFor(coursemateApi)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();