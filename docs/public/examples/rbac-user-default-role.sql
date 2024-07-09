DO $$
DECLARE
    group_name text := 'group:default/user'; -- Replace this with your desired group name
BEGIN
    INSERT INTO "permission"."role-metadata" ("roleEntityRef", "source", description, author, "modifiedBy", "createdAt", "lastModified") 
    VALUES('role:default/devportal-user', 'rest', NULL, 'user:default/admin', 'user:default/admin', now(), now());
    
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, catalog.entity.create, create, deny]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, catalog-entity, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, policy-entity, read, deny]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, policy-entity, create, deny]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, policy-entity, update, deny]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, policy-entity, delete, deny]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, cluster.explorer.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, cluster.explorer.public.environment.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, gitlab.pipelines.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, gitlab.pipelines.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, github.workflows.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, github.workflows.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, admin.access.read, read, deny]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, apiManagement.access.read, read, deny]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.update, update, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.delete, delete, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[' || group_name || ', role:default/devportal-user]', 'rest');

	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'catalog-entity', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'catalog.entity.create', 'create', 'deny', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'policy-entity', 'read', 'deny', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'policy-entity', 'create', 'deny', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'policy-entity', 'update', 'deny', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'policy-entity', 'delete', 'deny', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'cluster.explorer.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'cluster.explorer.public.environment.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'gitlab.pipelines.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'gitlab.pipelines.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'github.workflows.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'github.workflows.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'admin.access.read', 'read', 'deny', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'apiManagement.access.read', 'read', 'deny', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.update', 'update', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.delete', 'delete', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('g', group_name, 'role:default/devportal-user', NULL, NULL, NULL, NULL, NULL);
END $$;
