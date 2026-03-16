using System.Reflection;

namespace CourseMate.Contract;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}