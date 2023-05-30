package rpcc.service;

import rpcc.domain.Organization;

import java.util.List;

public interface OrganizationService {
    List<Organization> getOrganizations();

    Organization addOrganization(Organization organization);

    Organization updateOrganization(Long id, Organization updatedOrganization) throws OrganizationNotFoundException;

    void deleteOrganization(Long id);
}
