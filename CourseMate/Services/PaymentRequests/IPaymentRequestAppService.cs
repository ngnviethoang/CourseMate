using CourseMate.Services.Dtos.PaymentRequests;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.PaymentRequests;

public interface IPaymentRequestAppService : ICrudAppService<PaymentRequestDto, Guid, PagedAndSortedResultRequestDto, CreateUpdatePaymentRequestDto>;