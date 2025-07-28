using CourseMate.Services.Dtos.Carts;

namespace CourseMate.Services.Carts;

public interface ICartAppService : IApplicationService
{
    Task<PagedResultDto<CartDto>> GetListAsync(GetListCartRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateCartDto input);
    Task DeleteAsync(Guid id);
}