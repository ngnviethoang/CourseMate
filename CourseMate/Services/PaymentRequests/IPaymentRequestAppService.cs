using CourseMate.Services.Dtos.PaymentRequests;

namespace CourseMate.Services.PaymentRequests;

public interface IPaymentRequestAppService : ICrudAppService<PaymentRequestDto, Guid, PagedAndSortedResultRequestDto, CreateUpdatePaymentRequestDto>;