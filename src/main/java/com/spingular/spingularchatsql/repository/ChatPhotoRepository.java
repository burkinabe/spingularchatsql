package com.spingular.spingularchatsql.repository;
import com.spingular.spingularchatsql.domain.ChatPhoto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ChatPhoto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatPhotoRepository extends JpaRepository<ChatPhoto, Long>, JpaSpecificationExecutor<ChatPhoto> {

}
