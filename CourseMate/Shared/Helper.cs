using System.Text.RegularExpressions;
using System.Globalization;
using System.Text;

namespace CourseMate.Shared;

public static class Helper
{
    public static string StripNonBasicUnicode(this string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        return Regex.Replace(input, @"[^\u0020-\u00FF]", "");
    }

    public static string NormalizeFileName(this string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return string.Empty;
        }

        // Bước 1: Tách phần tên và phần mở rộng
        string extension = Path.GetExtension(fileName);
        string nameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

        // Bước 2: Chuyển tiếng Việt thành không dấu
        nameWithoutExt = RemoveDiacritics(nameWithoutExt);

        // Bước 3: Loại bỏ ký tự không hợp lệ
        nameWithoutExt = Regex.Replace(nameWithoutExt, @"[^a-zA-Z0-9\s-_]", "");

        // Bước 4: Thay khoảng trắng bằng gạch ngang, bỏ thừa
        nameWithoutExt = Regex.Replace(nameWithoutExt, @"\s+", "-").Trim('-');

        // Bước 5: Chuyển về chữ thường
        nameWithoutExt = nameWithoutExt.ToLowerInvariant();

        // Kết quả cuối cùng
        return nameWithoutExt + extension.ToLowerInvariant();
    }

    private static string RemoveDiacritics(string text)
    {
        string normalized = text.Normalize(NormalizationForm.FormD);
        StringBuilder sb = new();

        foreach (char c in normalized)
        {
            UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}