# Sử dụng hình ảnh SDK để build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy các file .csproj để restore (tối ưu hóa cache của Docker)
COPY ["FashionShop.API/FashionShop.API.csproj", "FashionShop.API/"]
COPY ["FashionShop.Core/FashionShop.Core.csproj", "FashionShop.Core/"]

# Restore các dependencies
RUN dotnet restore "FashionShop.API/FashionShop.API.csproj"

# Copy toàn bộ mã nguồn và build
COPY . .
WORKDIR "/src/FashionShop.API"
RUN dotnet build "FashionShop.API.csproj" -c Release -o /app/build

# Publish ứng dụng
FROM build AS publish
RUN dotnet publish "FashionShop.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Sử dụng hình ảnh Runtime để chạy ứng dụng (nhẹ hơn)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Mở cổng 80 (cổng mặc định của Render/Docker cho web)
EXPOSE 80
ENTRYPOINT ["dotnet", "FashionShop.API.dll"]