using System.Linq.Dynamic.Core;
using CourseMate.Entities.PaymentRequests;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.PaymentRequests;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.PaymentRequests;

[Authorize(CourseMatePermissions.PaymentRequests.Default)]
public class PaymentRequestAppService : CourseMateAppService, IPaymentRequestAppService
{
    public async Task<PaymentRequestDto> GetAsync(Guid id)
    {
        PaymentRequest paymentRequest = await PaymentRequestRepo.GetAsync(id);
        return ObjectMapper.Map<PaymentRequest, PaymentRequestDto>(paymentRequest);
    }

    public async Task<PagedResultDto<PaymentRequestDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<PaymentRequest> queryable = await PaymentRequestRepo.GetQueryableAsync();
        IQueryable<PaymentRequest> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<PaymentRequest> paymentRequests = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<PaymentRequestDto>(totalCount, ObjectMapper.Map<List<PaymentRequest>, List<PaymentRequestDto>>(paymentRequests));
    }

    [Authorize(CourseMatePermissions.PaymentRequests.Create)]
    public async Task<PaymentRequestDto> CreateAsync(CreateUpdatePaymentRequestDto input)
    {
        PaymentRequest paymentRequest = ObjectMapper.Map<CreateUpdatePaymentRequestDto, PaymentRequest>(input);
        await PaymentRequestRepo.InsertAsync(paymentRequest);
        return ObjectMapper.Map<PaymentRequest, PaymentRequestDto>(paymentRequest);
    }

    [Authorize(CourseMatePermissions.PaymentRequests.Edit)]
    public async Task<PaymentRequestDto> UpdateAsync(Guid id, CreateUpdatePaymentRequestDto input)
    {
        PaymentRequest paymentRequest = await PaymentRequestRepo.GetAsync(id);
        ObjectMapper.Map(input, paymentRequest);
        await PaymentRequestRepo.UpdateAsync(paymentRequest);
        return ObjectMapper.Map<PaymentRequest, PaymentRequestDto>(paymentRequest);
    }

    [Authorize(CourseMatePermissions.PaymentRequests.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await PaymentRequestRepo.DeleteAsync(id);
    }
}