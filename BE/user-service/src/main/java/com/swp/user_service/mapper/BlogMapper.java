package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.BlogRequest;
import com.swp.user_service.dto.response.BlogResponse;
import com.swp.user_service.entity.Blog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    Blog toBlog(BlogRequest request);
    BlogResponse toBlogResponse(Blog blog);
}