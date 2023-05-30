package rpcc.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rpcc.domain.Organization;
import rpcc.service.OrganizationService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {
    @Autowired
    private OrganizationService organizationService;

    @GetMapping("")
    public  ResponseEntity<List<Organization>> getOrganizations() {
        List<Organization> organizations = organizationService.getOrganizations();
        return ResponseEntity.ok(organizations);
    }

    @PostMapping("")
    public ResponseEntity<Organization> addOrganization(@Valid @RequestBody Organization organization) {
        Organization organizationCreated = organizationService.addOrganization(organization);
        if (organizationCreated != null)
            return ResponseEntity.ok(organizationCreated);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

//    put


    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity deleteOrganization(PathVariable Long id){
        if (!organizationService.countById(id))
            return new ResponseEntity("Organization with id " + id + " not found", HttpStatus.NOT_FOUND);
        userService.deleteUser(id);
        return new ResponseEntity("User under id: " + id + " successfully deleted.", HttpStatus.OK);
    }
}
