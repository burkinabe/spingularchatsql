package com.spingular.spingularchatsql.repository;
import com.spingular.spingularchatsql.domain.ChatOffensiveMessage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ChatOffensiveMessage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatOffensiveMessageRepository extends JpaRepository<ChatOffensiveMessage, Long>, JpaSpecificationExecutor<ChatOffensiveMessage> {

}
