using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Nsu.Belov.TrainsDatabase.Web.ValidationAnnotations
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class NotEqualAttribute : ValidationAttribute
    {
        private const string DefaultErrorMessage = "The value of {0} cannot be the same as the value of the {1}.";
        public string OtherProperty { get; private set; }

        public NotEqualAttribute(string otherProperty)
            : base(DefaultErrorMessage)
        {
            if (string.IsNullOrEmpty(otherProperty))
            {
                throw new ArgumentNullException(nameof(otherProperty));
            }

            OtherProperty = otherProperty;
        }

        public override string FormatErrorMessage(string name)
        {
            return string.Format(ErrorMessageString, name, OtherProperty);
        }

        protected override ValidationResult IsValid(object value,
            ValidationContext validationContext)
        {
            if (value == null) return ValidationResult.Success;
            var otherProperty = validationContext.ObjectInstance.GetType()
                .GetProperty(OtherProperty);

            var otherPropertyValue = otherProperty
                .GetValue(validationContext.ObjectInstance, null);

            if (value.Equals(otherPropertyValue))
            {
                return new ValidationResult(
                    FormatErrorMessage(validationContext.DisplayName));
            }

            return ValidationResult.Success;
        }
    }
}