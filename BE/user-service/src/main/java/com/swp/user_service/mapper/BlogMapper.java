package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.BlogRequest;
import com.swp.user_service.dto.response.BlogResponse;
import com.swp.user_service.entity.Blog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    Blog toBlog(BlogRequest request);
    BlogResponse toBlogResponse(Blog blog);
}