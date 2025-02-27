package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.BlogRequest;
import com.swp.user_service.dto.response.BlogResponse;
import com.swp.user_service.entity.Blog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    @Mapping(target = "id", ignore = true) // ID sẽ tự sinh
    @Mapping(target = "active", ignore = true) // active sẽ được set mặc định
    Blog toBlog(BlogRequest request);
    BlogResponse toBlogResponse(Blog blog);
}