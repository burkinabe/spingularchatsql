package com.spingular.spingularchatsql.service;

import com.spingular.spingularchatsql.service.dto.ChatOffensiveMessageDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link com.spingular.spingularchatsql.domain.ChatOffensiveMessage}.
 */
public interface ChatOffensiveMessageService {

    /**
     * Save a chatOffensiveMessage.
     *
     * @param chatOffensiveMessageDTO the entity to save.
     * @return the persisted entity.
     */
    ChatOffensiveMessageDTO save(ChatOffensiveMessageDTO chatOffensiveMessageDTO);

    /**
     * Get all the chatOffensiveMessages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ChatOffensiveMessageDTO> findAll(Pageable pageable);


    /**
     * Get the "id" chatOffensiveMessage.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChatOffensiveMessageDTO> findOne(Long id);

    /**
     * Delete the "id" chatOffensiveMessage.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
