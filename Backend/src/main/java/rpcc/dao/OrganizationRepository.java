package rpcc.dao;

import rpcc.domain.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, String>  {
    int countById(Long id);

    @Override
    boolean existsById(String s);
}
