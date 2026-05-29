namespace CourseMate.Contracts.Shared;

public static class StringFractionalIndexing
{
    public const string Base62Digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    public static string GenerateBetween(string? a, string? b, string digits = Base62Digits)
    {
        return GenerateKeyBetween(a, b, digits);
    }

    public static string GenerateKeyBetween(string? a, string? b, string digits = Base62Digits)
    {
        if (a != null)
        {
            ValidateOrderKey(a, digits);
        }

        if (b != null)
        {
            ValidateOrderKey(b, digits);
        }

        if (a != null && b != null && string.CompareOrdinal(a, b) >= 0)
        {
            throw new InvalidOperationException($"{a} >= {b}");
        }

        if (a == null)
        {
            if (b == null)
            {
                return "a" + digits[0];
            }

            string ib = GetIntegerPart(b);
            string fb = b[ib.Length..];

            if (ib == "A" + new string(digits[0], 26))
            {
                return ib + Midpoint(string.Empty, fb, digits);
            }

            if (string.CompareOrdinal(ib, b) < 0)
            {
                return ib;
            }

            string? decremented = DecrementInteger(ib, digits);
            if (decremented == null)
            {
                throw new InvalidOperationException("cannot decrement any more");
            }

            return decremented;
        }

        if (b == null)
        {
            string ia = GetIntegerPart(a);
            string fa = a[ia.Length..];
            string? incremented = IncrementInteger(ia, digits);
            return incremented == null ? ia + Midpoint(fa, null, digits) : incremented;
        }

        string iA = GetIntegerPart(a);
        string fA = a[iA.Length..];
        string iB = GetIntegerPart(b);
        string fB = b[iB.Length..];

        if (iA == iB)
        {
            return iA + Midpoint(fA, fB, digits);
        }

        string? i = IncrementInteger(iA, digits);
        if (i == null)
        {
            throw new InvalidOperationException("cannot increment any more");
        }

        if (string.CompareOrdinal(i, b) < 0)
        {
            return i;
        }

        return iA + Midpoint(fA, null, digits);
    }

    public static IReadOnlyList<string> GenerateNKeysBetween(string? a, string? b, int n, string digits = Base62Digits)
    {
        if (n < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(n), "n must be >= 0.");
        }

        if (n == 0)
        {
            return [];
        }

        if (n == 1)
        {
            return [GenerateKeyBetween(a, b, digits)];
        }

        if (b == null)
        {
            List<string> result = [];
            string c = GenerateKeyBetween(a, b, digits);
            result.Add(c);
            for (int i = 0; i < n - 1; i++)
            {
                c = GenerateKeyBetween(c, b, digits);
                result.Add(c);
            }

            return result;
        }

        if (a == null)
        {
            List<string> result = [];
            string c = GenerateKeyBetween(a, b, digits);
            result.Add(c);
            for (int i = 0; i < n - 1; i++)
            {
                c = GenerateKeyBetween(a, c, digits);
                result.Add(c);
            }

            result.Reverse();
            return result;
        }

        int mid = n / 2;
        string center = GenerateKeyBetween(a, b, digits);

        List<string> merged = [];
        merged.AddRange(GenerateNKeysBetween(a, center, mid, digits));
        merged.Add(center);
        merged.AddRange(GenerateNKeysBetween(center, b, n - mid - 1, digits));
        return merged;
    }

    private static string Midpoint(string a, string? b, string digits)
    {
        char zero = digits[0];

        if (b != null && string.CompareOrdinal(a, b) >= 0)
        {
            throw new InvalidOperationException($"{a} >= {b}");
        }

        if ((a.Length > 0 && a[^1] == zero) || (b != null && b.Length > 0 && b[^1] == zero))
        {
            throw new InvalidOperationException("trailing zero");
        }

        if (!string.IsNullOrEmpty(b))
        {
            int n = 0;
            while (n < b.Length && (n < a.Length ? a[n] : zero) == b[n])
            {
                n++;
            }

            if (n > 0)
            {
                string? nextB = n < b.Length ? b[n..] : null;
                return b[..n] + Midpoint(a[n..], nextB, digits);
            }
        }

        int digitA = a.Length > 0 ? digits.IndexOf(a[0]) : 0;
        int digitB = !string.IsNullOrEmpty(b) ? digits.IndexOf(b[0]) : digits.Length;

        if (digitA < 0 || digitB < 0)
        {
            throw new InvalidOperationException("invalid digit");
        }

        if (digitB - digitA > 1)
        {
            int midDigit = (int)Math.Round(0.5 * (digitA + digitB), MidpointRounding.AwayFromZero);
            return digits[midDigit].ToString();
        }

        if (!string.IsNullOrEmpty(b) && b.Length > 1)
        {
            return b[..1];
        }

        return digits[digitA] + Midpoint(a.Length > 0 ? a[1..] : string.Empty, null, digits);
    }

    private static void ValidateInteger(string integer)
    {
        if (integer.Length == 0 || integer.Length != GetIntegerLength(integer[0]))
        {
            throw new InvalidOperationException($"invalid integer part of order key: {integer}");
        }
    }

    private static int GetIntegerLength(char head)
    {
        if (head is >= 'a' and <= 'z')
        {
            return head - 'a' + 2;
        }

        if (head is >= 'A' and <= 'Z')
        {
            return 'Z' - head + 2;
        }

        throw new InvalidOperationException($"invalid order key head: {head}");
    }

    private static string GetIntegerPart(string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            throw new InvalidOperationException("Invalid order key: empty");
        }

        int integerPartLength = GetIntegerLength(key[0]);
        if (integerPartLength > key.Length)
        {
            throw new InvalidOperationException($"Invalid order key: {key}");
        }

        return key[..integerPartLength];
    }

    private static void ValidateOrderKey(string key, string digits)
    {
        if (key == "A" + new string(digits[0], 26))
        {
            throw new InvalidOperationException($"Invalid order key: {key}");
        }

        string integerPart = GetIntegerPart(key);
        string fractionalPart = key[integerPart.Length..];
        if (fractionalPart.Length > 0 && fractionalPart[^1] == digits[0])
        {
            throw new InvalidOperationException($"Invalid order key: {key}");
        }
    }

    private static string? IncrementInteger(string x, string digits)
    {
        ValidateInteger(x);

        char head = x[0];
        List<char> digs = x[1..].ToList();
        bool carry = true;

        for (int i = digs.Count - 1; carry && i >= 0; i--)
        {
            int d = digits.IndexOf(digs[i]) + 1;
            if (d == digits.Length)
            {
                digs[i] = digits[0];
            }
            else
            {
                digs[i] = digits[d];
                carry = false;
            }
        }

        if (carry)
        {
            if (head == 'Z')
            {
                return "a" + digits[0];
            }

            if (head == 'z')
            {
                return null;
            }

            char h = (char)(head + 1);
            if (h > 'a')
            {
                digs.Add(digits[0]);
            }
            else if (digs.Count > 0)
            {
                digs.RemoveAt(digs.Count - 1);
            }

            return h + new string(digs.ToArray());
        }

        return head + new string(digs.ToArray());
    }

    private static string? DecrementInteger(string x, string digits)
    {
        ValidateInteger(x);

        char head = x[0];
        List<char> digs = x[1..].ToList();
        bool borrow = true;

        for (int i = digs.Count - 1; borrow && i >= 0; i--)
        {
            int d = digits.IndexOf(digs[i]) - 1;
            if (d == -1)
            {
                digs[i] = digits[^1];
            }
            else
            {
                digs[i] = digits[d];
                borrow = false;
            }
        }

        if (borrow)
        {
            if (head == 'a')
            {
                return "Z" + digits[^1];
            }

            if (head == 'A')
            {
                return null;
            }

            char h = (char)(head - 1);
            if (h < 'Z')
            {
                digs.Add(digits[^1]);
            }
            else if (digs.Count > 0)
            {
                digs.RemoveAt(digs.Count - 1);
            }

            return h + new string(digs.ToArray());
        }

        return head + new string(digs.ToArray());
    }
}