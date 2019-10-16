package com.spingular.spingularchatsql.service.mapper;

import com.spingular.spingularchatsql.domain.*;
import com.spingular.spingularchatsql.service.dto.ChatPhotoDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link ChatPhoto} and its DTO {@link ChatPhotoDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ChatPhotoMapper extends EntityMapper<ChatPhotoDTO, ChatPhoto> {


    @Mapping(target = "chatUser", ignore = true)
    ChatPhoto toEntity(ChatPhotoDTO chatPhotoDTO);

    default ChatPhoto fromId(Long id) {
        if (id == null) {
            return null;
        }
        ChatPhoto chatPhoto = new ChatPhoto();
        chatPhoto.setId(id);
        return chatPhoto;
    }
}
