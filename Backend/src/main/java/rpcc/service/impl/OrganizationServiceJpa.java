package rpcc.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import rpcc.dao.OrganizationRepository;
import rpcc.domain.Organization;
import rpcc.service.OrganizationService;
import rpcc.service.RequestDeniedException;

import java.util.List;

@Service
public class OrganizationServiceJpa implements OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepo;

    @Override
    public List<Organization> getOrganizations() {
        return organizationRepo.findAll();
    }


    @Override
    public Organization addOrganization(Organization organization) {
        Assert.notNull(organization, "Organization object must be given.");
        if (organizationRepo.countById(organization.getId()) > 0) {
            throw new RequestDeniedException(
                    "Organization with id " + organization.getId() + " already exists."
            );
        }

        return organizationRepo.save(organization);
    }

//    @Override
//    public Organization deleteOrganization(Long id) {
//        Organization organization = organizationRepo.findById(id);
//        organizationRepo.delete(organization);
//        return organization;
//    }
}
