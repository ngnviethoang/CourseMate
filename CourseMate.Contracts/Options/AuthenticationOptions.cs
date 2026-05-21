namespace CourseMate.Contracts.Options;

public class AuthenticationOptions
{
    public GoogleAuthOptions Google { get; set; } = new();
}