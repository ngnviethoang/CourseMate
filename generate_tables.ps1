$output = ""
$entitiesDir = "d:\project\CourseMate\CourseMate.Persistent\Entities"
$files = Get-ChildItem -Path $entitiesDir -Recurse -Filter "*.cs"

$typeMap = @{
    "Guid" = "UUID"
    "Guid?" = "UUID"
    "string" = "VARCHAR(255)"
    "int" = "INT"
    "int?" = "INT"
    "long" = "BIGINT"
    "long?" = "BIGINT"
    "double" = "DOUBLE"
    "double?" = "DOUBLE"
    "decimal" = "DECIMAL"
    "decimal?" = "DECIMAL"
    "bool" = "BOOLEAN"
    "bool?" = "BOOLEAN"
    "DateTime" = "DATETIME"
    "DateTime?" = "DATETIME"
    "DateTimeOffset" = "DATETIME"
    "DateTimeOffset?" = "DATETIME"
    "TimeSpan" = "TIME"
    "TimeSpan?" = "TIME"
}

foreach ($file in $files) {
    if ($file.BaseName -eq "AssemblyReference" -or $file.BaseName -eq "Entity" -or $file.BaseName -eq "AuditableEntity") { continue }
    
    $output += "#### Bảng $($file.BaseName)`n`n"
    $output += "| Thuộc Tính | Diễn giải | Kiểu dữ liệu |`n"
    $output += "|---|---|---|`n"
    
    # Audit fields for all entities deriving from Entity
    $output += "| Id | Định danh duy nhất | UUID |`n"
    
    $content = Get-Content $file.FullName
    $pattern = 'public\s+(?:virtual\s+)?(?:[\w<>\?\[\]]+)\s+(\w+)\s*\{\s*get;'
    $regex = [regex]::new('public\s+(?:virtual\s+)?([\w<>\?\[\]]+)\s+(\w+)\s*\{\s*get;')
    
    $matches = $regex.Matches($content -join "`n")
    foreach ($match in $matches) {
        $type = $match.Groups[1].Value.Trim()
        $name = $match.Groups[2].Value.Trim()
        
        # Skip collection properties
        if ($type -match "ICollection|IList|IEnumerable|List") { continue }
        # Skip navigation properties (heuristic: starts with uppercase and not a standard type)
        if ($typeMap.ContainsKey($type)) {
            $sqlType = $typeMap[$type]
        } elseif ($type -match "Enum") {
            $sqlType = "INT"
        } else {
            # Likely an enum or complex type not caught. Default to INT for FK or Enum
            if ($name -match "Id$") {
                $sqlType = "UUID"
            } else {
                $sqlType = "INT/VARCHAR"
            }
        }
        
        # Generate description based on name
        $desc = "Trường $name"
        if ($name -eq "Id") { $desc = "Định danh duy nhất" }
        elseif ($name -match "Id$") { $desc = "Khóa ngoại tham chiếu đến $name" }
        elseif ($name -eq "CreationTime") { $desc = "Thời gian tạo" }
        elseif ($name -eq "LastModificationTime") { $desc = "Thời gian cập nhật cuối" }
        elseif ($name -eq "IsDeleted") { $desc = "Đã bị xóa mềm" }
        elseif ($name -eq "Name" -or $name -eq "Title") { $desc = "Tên/Tiêu đề" }
        elseif ($name -eq "Description") { $desc = "Mô tả chi tiết"; $sqlType = "TEXT" }
        elseif ($name -eq "IsActive" -or $name -match "^Is") { $desc = "Trạng thái $name" }
        
        $output += "| $name | $desc | $sqlType |`n"
    }
    
    $output += "| CreationTime | Thời gian tạo | DATETIME |`n"
    $output += "| LastModificationTime | Thời gian cập nhật cuối | DATETIME |`n"
    $output += "| IsDeleted | Đã bị xóa mềm | BOOLEAN |`n"
    $output += "`n"
}

Set-Content -Path "d:\project\CourseMate\tables.md" -Value $output
