package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.BlogRequest;
import com.swp.user_service.dto.response.BlogResponse;
import com.swp.user_service.entity.Blog;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class BlogMapperImpl implements BlogMapper {

    @Override
    public Blog toBlog(BlogRequest request) {
        if ( request == null ) {
            return null;
        }

        Blog.BlogBuilder blog = Blog.builder();

        blog.blogCode( request.getBlogCode() );
        blog.title( request.getTitle() );
        blog.description( request.getDescription() );

        return blog.build();
    }

    @Override
    public BlogResponse toBlogResponse(Blog blog) {
        if ( blog == null ) {
            return null;
        }

        BlogResponse.BlogResponseBuilder blogResponse = BlogResponse.builder();

        blogResponse.id( blog.getId() );
        blogResponse.blogCode( blog.getBlogCode() );
        blogResponse.title( blog.getTitle() );
        blogResponse.description( blog.getDescription() );

        return blogResponse.build();
    }
}
