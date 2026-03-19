FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS sdk
WORKDIR /src
COPY ["CourseMate.API", "CourseMate.API"]
COPY ["CourseMate.Application", "CourseMate.Application"]
COPY ["CourseMate.Contracts", "CourseMate.Contracts"]
COPY ["CourseMate.Infrastructure", "CourseMate.Infrastructure"]
RUN dotnet restore "CourseMate.API/CourseMate.API.csproj"

FROM sdk AS publish
WORKDIR /src/CourseMate.API
ARG CERT_PASSWORD=SampleValue
RUN dotnet publish "CourseMate.API.csproj" -c Release -o /app/publish /p:UseAppHost=false && \
    dotnet dev-certs https -ep /app/publish/aspnetapp.pfx -p "$CERT_PASSWORD" 

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine
EXPOSE 7071
ARG CERT_PASSWORD=SampleValue
ENV ASPNETCORE_URLS="https://+:7071"
ENV ASPNETCORE_Kestrel__Certificates__Default__Password="$CERT_PASSWORD"
ENV ASPNETCORE_Kestrel__Certificates__Default__Path="/app/aspnetapp.pfx"
COPY --from=publish /app/publish /app
WORKDIR /app
RUN id -u app >/dev/null || useradd -ms /bin/bash app && \
    chown -R app:app /app && chmod -R 755 /app
USER app
ENTRYPOINT ["dotnet", "CourseMate.API.dll"]
