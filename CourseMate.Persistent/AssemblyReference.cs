using System.Reflection;

namespace CourseMate.Persistent;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}