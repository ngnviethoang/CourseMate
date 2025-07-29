using System.ComponentModel;
using System.Globalization;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

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

    public static string DescriptionAttr<T>(this T source)
    {
        if (source is null)
        {
            throw new NullReferenceException(nameof(source));
        }

        FieldInfo? fi = source.GetType().GetField(source.ToString()!);

        if (fi?.GetCustomAttributes(typeof(DescriptionAttribute), false) is
            DescriptionAttribute[]
            {
                Length: > 0
            } attributes)
        {
            return attributes[0].Description;
        }

        return source.ToString()!;
    }

    /// <summary>
    ///     Convert To Date Int yyyyMMddHHmmss
    /// </summary>
    /// <param name="dateTime"></param>
    /// <returns>yyyyMMddHHmmss Format String</returns>
    public static string ConvertToDateIntString(DateTime dateTime)
    {
        return dateTime.ToString("yyyyMMddHHmmss");
    }

    public static string RemoveUnicode(string text)
    {
        string[] arr1 =
        [
            "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
            "đ",
            "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ",
            "í", "ì", "ỉ", "ĩ", "ị",
            "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ",
            "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự",
            "ý", "ỳ", "ỷ", "ỹ", "ỵ"
        ];
        string[] arr2 =
        [
            "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
            "d",
            "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
            "i", "i", "i", "i", "i",
            "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
            "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
            "y", "y", "y", "y", "y"
        ];
        for (int i = 0; i < arr1.Length; i++)
        {
            text = text.Replace(arr1[i], arr2[i]);
        }

        return text;
    }
}