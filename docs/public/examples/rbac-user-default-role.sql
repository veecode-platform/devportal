DO $$
DECLARE
    group_name text := 'group:default/user'; -- Replace this with your desired group name
BEGIN
    INSERT INTO "permission"."role-metadata" ("roleEntityRef", "source", description, author, "modifiedBy", "createdAt", "lastModified") 
    VALUES('role:default/devportal-user', 'rest', NULL, 'user:default/admin', 'user:default/admin', now(), now());
    
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, catalog-entity, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, catalog-entity, update, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, catalog.location.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, catalog.location.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, catalog.location.delete, delete, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, scaffolder.task.cancel, use, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, scaffolder.task.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, scaffolder.task.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, scaffolder-template, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, scaffolder-action, use, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, cluster.explorer.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, cluster.explorer.public.environment.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, gitlab.pipelines.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, gitlab.pipelines.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, github.workflows.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, github.workflows.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, admin.access.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, apiManagement.access.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.read, read, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.create, create, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.update, update, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kong.service.manager.delete, delete, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[role:default/devportal-user, kubernetes.proxy, use, allow]', 'rest');
	INSERT INTO "permission"."policy-metadata" ("policy", "source") VALUES('[' || group_name || ', role:default/devportal-user]', 'rest');

	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'catalog-entity', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'catalog-entity', 'update', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'catalog.location.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'catalog.location.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'catalog.location.delete', 'delete', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'scaffolder.task.cancel', 'use', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'scaffolder.task.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'scaffolder.task.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'scaffolder-template', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'scaffolder-action', 'use', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'cluster.explorer.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'cluster.explorer.public.environment.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'gitlab.pipelines.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'gitlab.pipelines.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'github.workflows.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'github.workflows.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'admin.access.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'apiManagement.access.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.read', 'read', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.create', 'create', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.update', 'update', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kong.service.manager.delete', 'delete', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('p', 'role:default/devportal-user', 'kubernetes.proxy', 'use', 'allow', NULL, NULL, NULL);
	INSERT INTO "permission".casbin_rule (ptype, v0, v1, v2, v3, v4, v5, v6) VALUES('g', group_name, 'role:default/devportal-user', NULL, NULL, NULL, NULL, NULL);

END $$;
