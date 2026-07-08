using System.Reflection;
using CourseMate.Contracts.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CourseMate.Contracts.Json;

public sealed class SensitiveDataMaskingContractResolver : DefaultContractResolver
{
    private readonly string _maskedValue;

    public SensitiveDataMaskingContractResolver(string maskedValue)
    {
        _maskedValue = maskedValue;
    }

    protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
    {
        JsonProperty property = base.CreateProperty(member, memberSerialization);
        if (property.PropertyType == typeof(string) && member.GetCustomAttribute<SensitiveDataAttribute>() != null)
        {
            property.ValueProvider = new MaskedValueProvider(_maskedValue);
        }

        return property;
    }

    private sealed class MaskedValueProvider : IValueProvider
    {
        private readonly string _maskedValue;

        public MaskedValueProvider(string maskedValue)
        {
            _maskedValue = maskedValue;
        }

        public object? GetValue(object target)
        {
            return _maskedValue;
        }

        public void SetValue(object target, object? value)
        {
        }
    }
}