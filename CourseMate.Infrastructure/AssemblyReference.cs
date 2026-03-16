using System.Reflection;

namespace CourseMate.Core;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}