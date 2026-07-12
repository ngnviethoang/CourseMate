using Npgsql;
using System.Text.Json;
using System.Text;

const string cs = "Host=localhost;Port=5432;Database=CourseMateV2;Username=postgres;Password=p@ssW0rd#6062!";

await using var conn = new NpgsqlConnection(cs);
await conn.OpenAsync();

Console.WriteLine("[0/9] Cleaning previous partial seed data...");
await using (var c = conn.CreateCommand())
{
    c.CommandText = @"
DELETE FROM ""ContestSubmissions"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""ContestRegistrations"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""ContestPrizes"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""ContestExercises"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""Contests"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""Enrollments"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""UserLessonProgresses"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""CourseSimilarities"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""CourseCoOccurrences"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""CourseEmbeddings"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""UserRecommendations"";
DELETE FROM ""ExerciseSubmissions"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""ExerciseTestCases"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""ExerciseExamples"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""ExerciseDefaultCodes"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
DELETE FROM ""Exercises"" WHERE ""CreationTime"" > NOW() - interval '1 hour';
";
    await c.ExecuteNonQueryAsync();
}
Console.WriteLine("  -> cleanup done");

await using var tx = await conn.BeginTransactionAsync();

static string N() => Guid.NewGuid().ToString();
static string J(params object?[] a) => JsonSerializer.Serialize(a, new JsonSerializerOptions { WriteIndented = false });

async Task Exec(string sql, params (string n, object v)[] p)
{
    await using var c = new NpgsqlCommand(sql, conn, tx);
    foreach (var (n, v) in p) c.Parameters.AddWithValue(n, v);
    await c.ExecuteNonQueryAsync();
}

static object U(object v) => v is string s ? (object)Guid.Parse(s) : v;

string[] instructors = {
    "019ddd8c-f558-7386-a796-18c878996313",
    "019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf",
    "019ddd8c-f603-72ac-a914-255b7bfd9e64"
};
string[] students = {
    "019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb",
    "019ddd8c-f6e1-7511-94bd-0a10582186a3",
    "019ddd8c-f773-7d46-9bf6-03a520cda5da"
};
string[] adminRoles = {
    "019ddd8c-f426-7111-910a-6cb2e5c6a751",
    "019ddd8c-f4fa-7bde-b5b5-838e03cde051"
};

string catCoSo = "fbb5c2ee-0724-4bbc-a075-450004d1f20c";
string catNangCao = "80e95633-2022-4c78-ab94-57c9d3d51e2d";
string catThuatToan = "5ac3586c-394f-45c2-b000-9332d118b498";
string catKyNang = "9483a3b6-2fc1-4536-9792-d998b843da73";
string catGiaiQuyet = "087499f3-3cc2-4d25-8ad5-8c63c6b74c44";

string coursePythonNC = "3600145f-dbec-412b-94f1-08942f6afa16";
string coursePythonCB = "efe114f7-dc5d-4059-a97b-4bbe5615ff4b";
string courseSQL = "7e7c3458-5caa-43c3-84d7-383ac98097f1";
string courseThuatToan = "3ffa0664-7966-4aa4-9557-049c00d033b7";
string courseCTDL = "3d68c61e-6eec-4416-8214-21930ae35f02";
string coursePythonAuto = "3dd82fcf-1316-40d6-85bb-a05fc30471db";
string courseJava = "3a7e4e2a-395f-4213-81c5-03d945e1852f";
string courseJavaNguoiMoi = "743dd717-48b2-45b1-b9c0-8ded60965ecb";
string courseCpp = "e166a9f1-6df5-4b31-86b6-66b419634bd9";
string courseCppCB = "3cfe0502-a9d6-4353-b87f-ed417a83124f";
string courseScratch = "e3e2c06a-408b-4330-a30f-6b9df6c5b61a";
string courseJSCB = "820b7ae8-fcf9-46f4-b206-36d3bc57a496";

Console.WriteLine("[1/9] Inserting Exercises (25 problems spanning categories)...");

var exercises = new (string id, string title, string desc, int diff, string cat, string creator, string constraints, string hints, string starterPy, string starterCpp, string starterJava, string starterJs)[]
{
    ("11111111-1111-1111-1111-000000000001", "Tính giai thừa", "Cho số nguyên dương n (0 ≤ n ≤ 20). Tính n!", 0, "Math", instructors[0], "[\"Time limit: 1000ms\",\"Memory limit: 128MB\"]", "[\"Dùng vòng lặp hoặc đệ quy\",\"Chú ý trường hợp n=0\"]", "def factorial(n):\n    # your code\n    pass", "long long factorial(int n) { /* your code */ }", "class Solution { long factorial(int n) { /* code */ } }", "function factorial(n) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000002", "Số Fibonacci thứ n", "Tính số Fibonacci thứ n (F(0)=0, F(1)=1).", 0, "Math", instructors[0], "[\"Time limit: 1000ms\",\"Memory limit: 128MB\"]", "[\"Dùng vòng lặp để tránh đệ quy chậm\",\"dp[i] = dp[i-1] + dp[i-2]\"]", "def fib(n):\n    # your code\n    pass", "long long fib(int n) { /* code */ }", "class Solution { long fib(int n) { /* code */ } }", "function fib(n) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000003", "Đảo chuỗi", "Cho chuỗi s, trả về chuỗi đảo ngược.", 0, "String", instructors[0], "[\"Time limit: 500ms\",\"Memory limit: 64MB\",\"Chuỗi không chứa ký tự đặc biệt\"]", "[\"Python: s[::-1]\",\"C++: std::reverse\"]", "def reverse_str(s):\n    # your code\n    pass", "std::string reverseStr(std::string s) { /* code */ }", "class Solution { String reverseStr(String s) { /* code */ } }", "function reverseStr(s) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000004", "Kiểm tra số nguyên tố", "Cho n (1 ≤ n ≤ 10^6), kiểm tra n có phải số nguyên tố.", 0, "Math", instructors[1], "[\"Time limit: 1000ms\",\"Memory limit: 128MB\"]", "[\"Thử chia từ 2 đến sqrt(n)\",\"Số 1 không phải nguyên tố\"]", "def is_prime(n):\n    # your code\n    pass", "bool isPrime(int n) { /* code */ }", "class Solution { boolean isPrime(int n) { /* code */ } }", "function isPrime(n) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000005", "Tìm phần tử lớn nhất trong mảng", "Cho mảng n số nguyên, tìm phần tử lớn nhất.", 0, "Array", instructors[0], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"Khởi tạo max = arr[0]\",\"Duyệt từ đầu đến cuối\"]", "def find_max(arr):\n    # your code\n    pass", "int findMax(std::vector<int>& arr) { /* code */ }", "class Solution { int findMax(int[] arr) { /* code */ } }", "function findMax(arr) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000006", "Tổng các số chẵn", "Tính tổng các số chẵn trong mảng.", 0, "Array", instructors[0], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"Kiểm tra n % 2 == 0\"]", "def sum_even(arr):\n    # your code\n    pass", "int sumEven(std::vector<int>& arr) { /* code */ }", "class Solution { int sumEven(int[] arr) { /* code */ } }", "function sumEven(arr) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000007", "Tìm kiếm nhị phân", "Cho mảng đã sắp xếp và giá trị x, trả về chỉ số của x hoặc -1.", 1, "Array", instructors[0], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\",\"Mảng đã được sắp xếp tăng dần\"]", "[\"left, right = 0, len(arr)-1\",\"So sánh arr[mid] với x\"]", "def binary_search(arr, x):\n    # your code\n    pass", "int binarySearch(std::vector<int>& arr, int x) { /* code */ }", "class Solution { int binarySearch(int[] arr, int x) { /* code */ } }", "function binarySearch(arr, x) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000008", "Sắp xếp nổi bọt", "Sắp xếp mảng tăng dần bằng bubble sort.", 1, "Sorting", instructors[1], "[\"Time limit: 2000ms\",\"Memory limit: 64MB\"]", "[\"So sánh từng cặp kề nhau\",\"Tối ưu: dừng sớm nếu không swap\"]", "def bubble_sort(arr):\n    # your code\n    pass", "void bubbleSort(std::vector<int>& arr) { /* code */ }", "class Solution { void bubbleSort(int[] arr) { /* code */ } }", "function bubbleSort(arr) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000009", "QuickSort", "Sắp xếp mảng bằng QuickSort.", 2, "Sorting", instructors[1], "[\"Time limit: 2000ms\",\"Memory limit: 128MB\",\"Chọn pivot hợp lý\"]", "[\"Chọn pivot\",\"Partition quanh pivot\"]", "def quicksort(arr):\n    # your code\n    pass", "void quicksort(std::vector<int>& arr, int lo, int hi) { /* code */ }", "class Solution { void quickSort(int[] arr, int lo, int hi) { /* code */ } }", "function quicksort(arr) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000010", "Tính tổng ước", "Tính tổng các ước số dương của n.", 0, "Math", instructors[0], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\"]", "[\"Duyệt từ 1 đến sqrt(n)\",\"Đếm cả ước i và n/i\"]", "def sum_divisors(n):\n    # your code\n    pass", "int sumDivisors(int n) { /* code */ }", "class Solution { int sumDivisors(int n) { /* code */ } }", "function sumDivisors(n) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000011", "Chuỗi Palindrome", "Kiểm tra chuỗi có phải palindrome (không phân biệt hoa thường).", 0, "String", instructors[0], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"So sánh 2 đầu\",\"Bỏ qua ký tự không phải chữ\"]", "def is_palindrome(s):\n    # your code\n    pass", "bool isPalindrome(std::string s) { /* code */ }", "class Solution { boolean isPalindrome(String s) { /* code */ } }", "function isPalindrome(s) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000012", "Đếm từ trong chuỗi", "Đếm số từ trong chuỗi (các từ cách nhau bởi dấu cách).", 0, "String", instructors[1], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"Tách chuỗi theo khoảng trắng\",\"Bỏ chuỗi rỗng\"]", "def count_words(s):\n    # your code\n    pass", "int countWords(std::string s) { /* code */ }", "class Solution { int countWords(String s) { /* code */ } }", "function countWords(s) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000013", "Cây nhị phân - duyệt DFS", "Cho cây nhị phân, in ra duyệt theo thứ tự trước (preorder).", 2, "Tree", instructors[2], "[\"Time limit: 2000ms\",\"Memory limit: 128MB\",\"Đệ quy có thể gây tràn stack\"]", "[\"Dùng đệ quy\",\"Node -> Left -> Right\"]", "def preorder(node):\n    # your code\n    pass", "void preorder(Node* node) { /* code */ }", "class Solution { void preorder(TreeNode node) { /* code */ } }", "function preorder(node) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000014", "BFS trên đồ thị", "Cho đồ thị vô hướng và đỉnh bắt đầu, in ra thứ tự BFS.", 2, "Graph", instructors[2], "[\"Time limit: 2000ms\",\"Memory limit: 128MB\"]", "[\"Dùng queue\",\"Đánh dấu visited\"]", "def bfs(graph, start):\n    # your code\n    pass", "std::vector<int> bfs(std::vector<std::vector<int>>& graph, int start) { /* code */ }", "class Solution { int[] bfs(int[][] graph, int start) { /* code */ } }", "function bfs(graph, start) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000015", "Quy hoạch động: bậc thang", "Có n bậc thang, mỗi bước lên 1 hoặc 2 bậc. Đếm số cách lên đến đỉnh.", 2, "Dynamic Programming", instructors[1], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\",\"1 <= n <= 45\"]", "[\"dp[i] = dp[i-1] + dp[i-2]\",\"dp[0]=1, dp[1]=1\"]", "def climb_stairs(n):\n    # your code\n    pass", "int climbStairs(int n) { /* code */ }", "class Solution { int climbStairs(int n) { /* code */ } }", "function climbStairs(n) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000016", "SQL: Lấy sinh viên có điểm cao nhất", "Cho bảng Students(id, name, score), truy vấn sinh viên có score cao nhất.", 1, "SQL", instructors[0], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\"]", "[\"ORDER BY score DESC LIMIT 1\",\"Hoặc dùng subquery\"]", "SELECT * FROM Students ORDER BY score DESC LIMIT 1;", "SELECT * FROM Students ORDER BY score DESC LIMIT 1;", "SELECT * FROM Students ORDER BY score DESC LIMIT 1;", "SELECT * FROM Students ORDER BY score DESC LIMIT 1;"),
    ("11111111-1111-1111-1111-000000000017", "Hash map: đếm tần suất ký tự", "Đếm số lần xuất hiện của từng ký tự trong chuỗi.", 1, "Hash", instructors[0], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"Dùng dict/Counter\",\"Trả về dict char -> count\"]", "from collections import Counter\ndef char_count(s):\n    # your code\n    pass", "std::map<char,int> charCount(std::string s) { /* code */ }", "class Solution { Map<Character,Integer> charCount(String s) { /* code */ } }", "function charCount(s) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000018", "Linked List: đảo danh sách", "Đảo ngược linked list 1 chiều.", 1, "Linked List", instructors[1], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\"]", "[\"Dùng 3 con trỏ: prev, curr, next\",\"Hoặc đệ quy\"]", "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    # your code\n    pass", "ListNode* reverseList(ListNode* head) { /* code */ }", "class Solution { ListNode reverseList(ListNode head) { /* code */ } }", "function reverseList(head) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000019", "Tính lũy thừa nhanh", "Tính a^b mod 10^9+7.", 2, "Math", instructors[1], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\",\"Modulo 10^9+7\"]", "[\"Dùng fast exponentiation\",\"Đệ quy hoặc lặp\"]", "MOD = 10**9 + 7\ndef power(a, b):\n    # your code\n    pass", "const long MOD = 1e9+7; long power(long a, long b) { /* code */ }", "class Solution { long power(long a, long b) { /* code */ } }", "function power(a, b) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000020", "Tổng mảng con liên tiếp max", "Cho mảng số nguyên (có số âm), tìm tổng lớn nhất của mảng con liên tiếp (Kadane).", 1, "Array", instructors[0], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\",\"Mảng có ít nhất 1 phần tử\"]", "[\"Thuật toán Kadane\",\"current_max = max(arr[i], current_max + arr[i])\"]", "def max_subarray(arr):\n    # your code\n    pass", "int maxSubarray(std::vector<int>& arr) { /* code */ }", "class Solution { int maxSubarray(int[] arr) { /* code */ } }", "function maxSubarray(arr) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000021", "Anagram check", "Kiểm tra 2 chuỗi có phải anagram (sắp xếp lại thành nhau) không.", 1, "String", instructors[0], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"Đếm tần suất ký tự\",\"Hoặc sort và so sánh\"]", "def is_anagram(s, t):\n    # your code\n    pass", "bool isAnagram(std::string s, std::string t) { /* code */ }", "class Solution { boolean isAnagram(String s, String t) { /* code */ } }", "function isAnagram(s, t) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000022", "Validate Parentheses", "Kiểm tra chuỗi ngoặc (), [], {} có hợp lệ không.", 1, "Stack", instructors[1], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"Dùng stack\",\"Đẩy ngoặc mở, pop khi gặp ngoặc đóng\"]", "def is_valid(s):\n    # your code\n    pass", "bool isValid(std::string s) { /* code */ }", "class Solution { boolean isValid(String s) { /* code */ } }", "function isValid(s) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000023", "Tìm số lặp lại đầu tiên", "Cho mảng n số, tìm số lặp lại đầu tiên, trả về -1 nếu không có.", 1, "Array", instructors[2], "[\"Time limit: 1000ms\",\"Memory limit: 64MB\"]", "[\"Dùng set\",\"Thêm từng phần tử và check\"]", "def first_duplicate(arr):\n    # your code\n    pass", "int firstDuplicate(std::vector<int>& arr) { /* code */ }", "class Solution { int firstDuplicate(int[] arr) { /* code */ } }", "function firstDuplicate(arr) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000024", "Đổi cơ số 10 sang 2", "Cho số nguyên dương n, in biểu diễn nhị phân.", 0, "Math", instructors[0], "[\"Time limit: 500ms\",\"Memory limit: 64MB\"]", "[\"Lặp chia 2\",\"Python: bin(n)\"]", "def to_binary(n):\n    # your code\n    pass", "std::string toBinary(int n) { /* code */ }", "class Solution { String toBinary(int n) { /* code */ } }", "function toBinary(n) { /* your code */ }"),
    ("11111111-1111-1111-1111-000000000025", "Scratch: vẽ hình vuông", "Viết chương trình Scratch vẽ hình vuông cạnh 100.", 0, "Scratch", instructors[2], "[\"Time limit: 5000ms\",\"Memory limit: 64MB\"]", "[\"Lặp 4 lần: di chuyển 100, xoay 90 độ\"]", "when flag clicked\nrepeat 4\n    move 100 steps\n    turn 90 degrees\nend", "Scratch blocks: when flag clicked -> repeat 4 { move 100; turn 90 }", "Scratch: when flag clicked -> repeat 4 { move 100; turn 90 }", "Scratch: when flag clicked -> repeat 4 { move 100; turn 90 }")
};

foreach (var e in exercises)
{
    await Exec(@"INSERT INTO ""Exercises"" (""Id"", ""Title"", ""Description"", ""Difficulty"", ""Category"", ""CreatorId"", ""Constraints"", ""Hints"", ""IsHidden"", ""CreationTime"", ""IsDeleted"")
                VALUES (@id::uuid, @t::text, @d::text, @diff, @cat, @creator::uuid, @cons::jsonb, @hints::jsonb, false, NOW(), false)",
        ("@id", e.id), ("@t", e.title), ("@d", e.desc), ("@diff", e.diff), ("@cat", e.cat), ("@creator", e.creator),
        ("@cons", e.constraints), ("@hints", e.hints));
}

Console.WriteLine($"  -> inserted {exercises.Length} exercises");

Console.WriteLine("[2/9] Inserting ExerciseTestCases, Examples, DefaultCodes...");

int tcCount = 0, exCount = 0, dcCount = 0;
foreach (var e in exercises)
{
    string[] testInputs = { "5", "10", "0", "100" };
    string[] testOutputs = { "120", "3628800", "1", "0" };
    for (int i = 0; i < testInputs.Length; i++)
    {
        string tid = N();
        await Exec(@"INSERT INTO ""ExerciseTestCases"" (""Id"", ""ExerciseId"", ""Input"", ""ExpectedOutput"", ""Description"", ""IsHidden"", ""Order"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @eid::uuid, @inp, @out, @desc, @hidden, @ord, NOW(), false)",
            ("@id", tid), ("@eid", e.id), ("@inp", testInputs[i]), ("@out", testOutputs[i]), ("@desc", $"Test case {i+1}"), ("@hidden", i >= 2), ("@ord", i+1));
        tcCount++;
    }
    for (int i = 0; i < 2; i++)
    {
        string eid = N();
        await Exec(@"INSERT INTO ""ExerciseExamples"" (""Id"", ""Input"", ""Output"", ""Explanation"", ""ExerciseId"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @inp, @out, @exp, @eid::uuid, NOW(), false)",
            ("@id", eid), ("@inp", testInputs[i]), ("@out", testOutputs[i]), ("@exp", $"Ví dụ {i+1}: input {testInputs[i]} -> output {testOutputs[i]}"), ("@eid", e.id));
        exCount++;
    }
    var langs = new[] { "python", "cpp", "java", "javascript" };
    var starters = new[] { e.starterPy, e.starterCpp, e.starterJava, e.starterJs };
    for (int i = 0; i < langs.Length; i++)
    {
        string did = N();
        await Exec(@"INSERT INTO ""ExerciseDefaultCodes"" (""Id"", ""ExerciseId"", ""Language"", ""StarterCode"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @eid::uuid, @lang, @code, NOW(), false)",
            ("@id", did), ("@eid", e.id), ("@lang", langs[i]), ("@code", starters[i]));
        dcCount++;
    }
}
Console.WriteLine($"  -> {tcCount} test cases, {exCount} examples, {dcCount} starter codes");

Console.WriteLine("[3/9] Inserting ExerciseSubmissions (history)...");
int subCount = 0;
foreach (var student in students)
{
    for (int i = 0; i < 12; i++)
    {
        var ex = exercises[i % exercises.Length];
        string sid = N();
        var langs = new[] { "python", "cpp", "java", "javascript" };
        var lang = langs[i % langs.Length];
        var passed = (i % 3) != 0;
        var code = passed ? "print(result)\n# passed" : "print('wrong answer')";
        await Exec(@"INSERT INTO ""ExerciseSubmissions"" (""Id"", ""ExerciseId"", ""Language"", ""Code"", ""IsPassed"", ""Score"", ""TotalTime"", ""TotalMemory"", ""UserId"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @eid::uuid, @lang, @code, @pass, @score, @time, @mem, @uid::uuid, NOW() - (@ago || ' minutes')::interval, false)",
            ("@id", sid), ("@eid", ex.id), ("@lang", lang), ("@code", code), ("@pass", passed),
            ("@score", passed ? 100.0 : 0.0), ("@time", passed ? 0.1 + i*0.05 : 5.0), ("@mem", passed ? 1024 + i*100 : 8192),
            ("@uid", student), ("@ago", i * 30));
        subCount++;
    }
}
Console.WriteLine($"  -> {subCount} exercise submissions");

Console.WriteLine("[4/9] Inserting Contests, ContestExercises, ContestPrizes, ContestRegistrations...");

var contests = new (string id, string title, string desc, int status, DateTime start, DateTime end, int duration, string lang, int mem, int time, int anti, string creator, int maxViol)[]
{
    ("22222222-2222-2222-2222-000000000001", "Weekly Contest #1 - Thuật toán cơ bản", "Giải các bài tập thuật toán cơ bản: tìm kiếm, sắp xếp, đệ quy.", 1, DateTime.UtcNow.AddDays(-7), DateTime.UtcNow.AddDays(-7).AddHours(2), 120, "python,cpp,java,javascript", 256, 2000, 1, instructors[0], 3),
    ("22222222-2222-2222-2222-000000000002", "Weekly Contest #2 - Cấu trúc dữ liệu", "Áp dụng stack, queue, hash map, tree vào giải bài.", 1, DateTime.UtcNow.AddDays(-3), DateTime.UtcNow.AddDays(-3).AddHours(2), 120, "python,cpp,java", 256, 2000, 2, instructors[1], 3),
    ("22222222-2222-2222-2222-000000000003", "Thuật toán nâng cao - DP & Graph", "Contest nâng cao về quy hoạch động và đồ thị.", 2, DateTime.UtcNow.AddHours(3), DateTime.UtcNow.AddHours(5), 120, "python,cpp,java", 256, 2000, 2, instructors[2], 3),
    ("22222222-2222-2222-2222-000000000004", "SQL Practice Contest", "Contest về SQL queries, joins, subqueries.", 0, DateTime.UtcNow.AddDays(2), DateTime.UtcNow.AddDays(2).AddHours(2), 120, "python", 256, 2000, 1, instructors[0], 3),
    ("22222222-2222-2222-2222-000000000005", "Scratch Marathon", "Cuộc thi lập trình Scratch cho học sinh.", 1, DateTime.UtcNow.AddDays(-14), DateTime.UtcNow.AddDays(-14).AddHours(3), 180, "scratch", 128, 5000, 1, instructors[2], 5)
};

foreach (var ct in contests)
{
    await Exec(@"INSERT INTO ""Contests"" (""Id"", ""Title"", ""Description"", ""Status"", ""StartTime"", ""EndTime"", ""DurationInMinutes"", ""AllowedLanguages"", ""MemoryLimit"", ""TimeLimit"", ""AntiCheatLevel"", ""MaxViolations"", ""CreatorId"", ""CreationTime"", ""IsDeleted"")
                VALUES (@id::uuid, @t::text, @d::text, @status, @start, @end, @dur, @lang, @mem, @time, @anti, @mv, @creator::uuid, NOW() - interval '30 days', false)",
        ("@id", ct.id), ("@t", ct.title), ("@d", ct.desc), ("@status", ct.status), ("@start", ct.start), ("@end", ct.end),
        ("@dur", ct.duration), ("@lang", ct.lang), ("@mem", ct.mem), ("@time", ct.time), ("@anti", ct.anti), ("@mv", ct.maxViol), ("@creator", ct.creator));
}

int ceCount = 0;
foreach (var ct in contests)
{
    int numEx = ct.title.Contains("DP") ? 5 : (ct.title.Contains("SQL") ? 4 : (ct.title.Contains("Scratch") ? 3 : 4));
    for (int i = 0; i < numEx; i++)
    {
        var ex = exercises[Math.Abs(ct.id.GetHashCode() + i) % exercises.Length];
        string ceid = N();
        await Exec(@"INSERT INTO ""ContestExercises"" (""Id"", ""ContestId"", ""ExerciseId"", ""ScoreWeight"", ""Order"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @cid::uuid, @eid::uuid, @sw, @ord, NOW(), false)",
            ("@id", ceid), ("@cid", ct.id), ("@eid", ex.id), ("@sw", 100 / numEx), ("@ord", i + 1));
        ceCount++;
    }
}

int prizeCount = 0;
foreach (var ct in contests.Take(3))
{
    string pid1 = N();
    await Exec(@"INSERT INTO ""ContestPrizes"" (""Id"", ""ContestId"", ""CourseId"", ""MinRank"", ""MaxRank"", ""CreationTime"", ""IsDeleted"")
                VALUES (@id::uuid, @cid::uuid, @course::uuid, @min, @max, NOW(), false)",
        ("@id", pid1), ("@cid", ct.id), ("@course", coursePythonNC), ("@min", 1), ("@max", 1));
    string pid2 = N();
    await Exec(@"INSERT INTO ""ContestPrizes"" (""Id"", ""ContestId"", ""CourseId"", ""MinRank"", ""MaxRank"", ""CreationTime"", ""IsDeleted"")
                VALUES (@id::uuid, @cid::uuid, @course::uuid, @min, @max, NOW(), false)",
        ("@id", pid2), ("@cid", ct.id), ("@course", courseThuatToan), ("@min", 2), ("@max", 3));
    prizeCount += 2;
}

int regCount = 0;
foreach (var ct in contests.Take(3))
{
    foreach (var s in students)
    {
        string rid = N();
        bool submit = ct.status == 1;
        await Exec(@"INSERT INTO ""ContestRegistrations"" (""Id"", ""ContestId"", ""StudentId"", ""RegistrationTime"", ""JoinTime"", ""SubmitTime"", ""IsDisqualified"", ""ViolationCount"", ""DisqualifiedReason"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @cid::uuid, @sid::uuid, NOW() - interval '10 days', @join, @submit, false, 0, '', NOW(), false)",
            ("@id", rid), ("@cid", ct.id), ("@sid", s), ("@join", ct.start), ("@submit", submit ? ct.end : (object?)DBNull.Value));
        regCount++;
    }
}

int csCount = 0;
foreach (var ct in contests.Take(2))
{
    foreach (var s in students)
    {
        for (int i = 0; i < 4; i++)
        {
            var ex = exercises[i % exercises.Length];
            string csid = N();
            var score = 60 + (i * 10);
            var time = 30f + (i * 25f);
            await Exec(@"INSERT INTO ""ContestSubmissions"" (""Id"", ""ContestId"", ""ExerciseId"", ""StudentId"", ""Language"", ""Code"", ""Score"", ""TotalTime"", ""TotalMemory"", ""IsFinal"", ""UserId"", ""CreationTime"", ""IsDeleted"")
                        VALUES (@id::uuid, @cid::uuid, @eid::uuid, @sid::uuid, @lang, @code, @score, @time, @mem, @final, @uid::uuid, NOW() - interval '7 days', false)",
                ("@id", csid), ("@cid", ct.id), ("@eid", ex.id), ("@sid", s),
                ("@lang", new[] { "python", "cpp", "java" } [i % 3]),
                ("@code", "def solve():\n    return result\n# attempt"),
                ("@score", score), ("@time", time), ("@mem", 1024 + i * 256), ("@final", i == 3), ("@uid", s));
            csCount++;
        }
    }
}
Console.WriteLine($"  -> {contests.Length} contests, {ceCount} contest exercises, {prizeCount} prizes, {regCount} registrations, {csCount} submissions");

Console.WriteLine("[5/9] Inserting Enrollments (more realistic history)...");

var courseList = new[] { coursePythonCB, courseSQL, courseJSCB, coursePythonNC, courseCTDL, courseThuatToan, coursePythonAuto, courseCppCB, courseJava, courseScratch, courseJavaNguoiMoi, courseCpp };
int enrollCount = 0;
foreach (var s in students)
{
    foreach (var c in courseList)
    {
        string eid = N();
        await Exec(@"INSERT INTO ""Enrollments"" (""Id"", ""StudentId"", ""CourseId"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @sid::uuid, @cid::uuid, NOW() - (@ago || ' days')::interval, false)",
            ("@id", eid), ("@sid", s), ("@cid", c), ("@ago", enrollCount * 2 + 1));
        enrollCount++;
    }
}
Console.WriteLine($"  -> {enrollCount} enrollments");

Console.WriteLine("[6/9] Inserting UserLessonProgresses...");
int lpCount = 0;
List<string> lessons;
await using (var lc = new NpgsqlCommand("SELECT \"Id\" FROM \"Lessons\" ORDER BY \"ChapterId\", \"Position\" LIMIT 200", conn, tx))
{
    await using var rd = await lc.ExecuteReaderAsync();
    lessons = new List<string>();
    while (await rd.ReadAsync()) lessons.Add(rd.GetGuid(0).ToString());
}
foreach (var s in students)
{
    var picked = lessons.Take(20 + (Math.Abs(s.GetHashCode()) % 30)).ToList();
    foreach (var l in picked)
    {
        string lpid = N();
        bool completed = (lpCount % 3) != 0;
            await Exec(@"INSERT INTO ""UserLessonProgresses"" (""Id"", ""StudentId"", ""LessonId"", ""IsCompleted"", ""Score"", ""CreationTime"", ""IsDeleted"")
                        VALUES (@id::uuid, @sid::uuid, @lid::uuid, @done, @score, NOW() - (@ago || ' days')::interval, false)",
                ("@id", lpid), ("@sid", s), ("@lid", l), ("@done", completed), ("@score", completed ? 85.0 : 30.0), ("@ago", lpCount % 60 + 1));
            lpCount++;
        }
}
Console.WriteLine($"  -> {lpCount} lesson progress records");

Console.WriteLine("[7/9] Building CourseSimilarities, CourseCoOccurrences, CourseEmbeddings...");

var pubCourses = new[] { coursePythonCB, courseSQL, courseJSCB, coursePythonNC, courseCTDL, courseThuatToan, coursePythonAuto, courseCppCB, courseJava, courseScratch, courseJavaNguoiMoi, courseCpp };

int simCount = 0;
var rng = new Random(42);
for (int i = 0; i < pubCourses.Length; i++)
{
    for (int j = 0; j < pubCourses.Length; j++)
    {
        if (i == j) continue;
        var score = 0.5 + rng.NextDouble() * 0.5;
        string sid = N();
        await Exec(@"INSERT INTO ""CourseSimilarities"" (""Id"", ""CourseId"", ""SimilarCourseId"", ""Score"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @cid::uuid, @scid::uuid, @score, NOW(), false)",
            ("@id", sid), ("@cid", pubCourses[i]), ("@scid", pubCourses[j]), ("@score", score));
        simCount++;
    }
}

int coCount = 0;
for (int i = 0; i < pubCourses.Length; i++)
{
    for (int j = i + 1; j < pubCourses.Length; j++)
    {
        var weight = 0.3 + rng.NextDouble() * 0.7;
        var cocount = (int)(weight * 50) + 1;
        string coid = N();
        await Exec(@"INSERT INTO ""CourseCoOccurrences"" (""Id"", ""CourseId"", ""CoCourseId"", ""Weight"", ""CoCount"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @c1::uuid, @c2::uuid, @w, @cc, NOW(), false)",
            ("@id", coid), ("@c1", pubCourses[i]), ("@c2", pubCourses[j]), ("@w", weight), ("@cc", cocount));
        coCount++;
    }
}

int embCount = 0;
foreach (var c in pubCourses)
{
    float[] vec = new float[768];
    for (int i = 0; i < 768; i++) vec[i] = (float)(rng.NextDouble() * 2 - 1);
    var sb = new StringBuilder("[");
    for (int i = 0; i < vec.Length; i++) { if (i > 0) sb.Append(','); sb.Append(vec[i].ToString("F6")); }
    sb.Append(']');
    string eid = N();
    await Exec(@"INSERT INTO ""CourseEmbeddings"" (""Id"", ""CourseId"", ""Embedding"", ""CreationTime"", ""IsDeleted"")
                VALUES (@id::uuid, @cid::uuid, @emb::text::vector, NOW(), false)",
        ("@id", eid), ("@cid", c), ("@emb", sb.ToString()));
    embCount++;
}
Console.WriteLine($"  -> {simCount} similarities, {coCount} co-occurrences, {embCount} embeddings");

Console.WriteLine("[8/9] Building UserRecommendations with hybrid scoring (matching the algorithm weights)...");

var studentProfiles = new Dictionary<string, (string[] taken, string[] liked)>
{
    { students[0], (new[] { coursePythonCB, courseSQL, courseCTDL, coursePythonNC }, new[] { courseThuatToan, coursePythonAuto }) },
    { students[1], (new[] { courseJSCB, courseScratch, courseCppCB }, new[] { coursePythonCB, courseJava }) },
    { students[2], (new[] { courseJava, courseJavaNguoiMoi, courseCTDL }, new[] { coursePythonNC, courseThuatToan }) }
};

async Task<double> MaxScore(string sql)
{
    await using var c = new NpgsqlCommand(sql, conn, tx);
    var v = await c.ExecuteScalarAsync();
    return v != null && v != DBNull.Value ? Convert.ToDouble(v) : 0.0;
}

int recCount = 0;
foreach (var s in students)
{
    var (taken, liked) = studentProfiles[s];
    var candidates = pubCourses.Except(taken).ToList();
    var scored = new List<(string cid, double score)>();
    foreach (var c in candidates)
    {
        double contentSim = 0.0;
        foreach (var t in taken)
        {
            var s2 = await MaxScore($"SELECT \"Score\" FROM \"CourseSimilarities\" WHERE \"CourseId\"='{t}' AND \"SimilarCourseId\"='{c}'");
            if (s2 > contentSim) contentSim = s2;
        }

        double behaviorScore = 0.0;
        foreach (var lk in liked)
        {
            var s2 = await MaxScore($"SELECT \"Weight\" FROM \"CourseCoOccurrences\" WHERE (\"CourseId\"='{lk}' AND \"CoCourseId\"='{c}') OR (\"CourseId\"='{c}' AND \"CoCourseId\"='{lk}') LIMIT 1");
            if (s2 > behaviorScore) behaviorScore = s2;
        }

        double categoryAffinity = 0.0;
        foreach (var t in taken)
        {
            var same = await new NpgsqlCommand($"SELECT 1 FROM \"Courses\" c1, \"Courses\" c2 WHERE c1.\"Id\"='{c}' AND c2.\"Id\"='{t}' AND c1.\"CategoryId\"=c2.\"CategoryId\"", conn, tx).ExecuteScalarAsync();
            if (same != null) categoryAffinity = 1.0;
        }

        var enCount = Convert.ToInt32(await new NpgsqlCommand($"SELECT COUNT(*) FROM \"Enrollments\" WHERE \"CourseId\"='{c}'", conn, tx).ExecuteScalarAsync() ?? 0);
        double popularity = Math.Min(1.0, enCount / 5.0);

        double score = contentSim * 0.45 + behaviorScore * 0.35 + categoryAffinity * 0.1 + popularity * 0.1;
        scored.Add((c, score));
    }
    var top = scored.OrderByDescending(x => x.score).Take(5).ToList();
    int rank = 1;
    foreach (var (cid, score) in top)
    {
        string recid = N();
        await Exec(@"INSERT INTO ""UserRecommendations"" (""Id"", ""UserId"", ""CourseId"", ""Score"", ""Rank"", ""GeneratedAt"", ""CreationTime"", ""IsDeleted"")
                    VALUES (@id::uuid, @uid::uuid, @cid::uuid, @score, @rank, NOW(), NOW(), false)",
            ("@id", recid), ("@uid", s), ("@cid", cid), ("@score", score), ("@rank", rank));
        rank++;
        recCount++;
    }
}
Console.WriteLine($"  -> {recCount} user recommendations (top-5 per student, hybrid scoring)");

Console.WriteLine("[9/9] Final verification...");
var stats = new (string t, string q)[]
{
    ("Exercises", "SELECT COUNT(*) FROM \"Exercises\""),
    ("Test cases", "SELECT COUNT(*) FROM \"ExerciseTestCases\""),
    ("Submissions", "SELECT COUNT(*) FROM \"ExerciseSubmissions\""),
    ("Contests", "SELECT COUNT(*) FROM \"Contests\""),
    ("ContestExercises", "SELECT COUNT(*) FROM \"ContestExercises\""),
    ("ContestPrizes", "SELECT COUNT(*) FROM \"ContestPrizes\""),
    ("ContestRegistrations", "SELECT COUNT(*) FROM \"ContestRegistrations\""),
    ("ContestSubmissions", "SELECT COUNT(*) FROM \"ContestSubmissions\""),
    ("Enrollments", "SELECT COUNT(*) FROM \"Enrollments\""),
    ("UserLessonProgress", "SELECT COUNT(*) FROM \"UserLessonProgresses\""),
    ("CourseSimilarities", "SELECT COUNT(*) FROM \"CourseSimilarities\""),
    ("CourseCoOccurrences", "SELECT COUNT(*) FROM \"CourseCoOccurrences\""),
    ("CourseEmbeddings", "SELECT COUNT(*) FROM \"CourseEmbeddings\""),
    ("UserRecommendations", "SELECT COUNT(*) FROM \"UserRecommendations\"")
};
foreach (var (t, q) in stats)
{
    await using var c = new NpgsqlCommand(q, conn, tx);
    var cnt = await c.ExecuteScalarAsync();
    Console.WriteLine($"  {t,-25}: {cnt}");
}

await tx.CommitAsync();
Console.WriteLine("\nDONE. Transaction committed.");
