package rpcc.service;

import rpcc.domain.Organization;

import java.util.List;

public interface OrganizationService {
    List<Organization> getOrganizations();

    Organization addOrganization(Organization organization);

//    Organization deleteOrganization(Long id);
}
