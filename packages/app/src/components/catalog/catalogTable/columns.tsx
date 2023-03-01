import React from 'react';
import {
  humanizeEntityRef,
  EntityRefLink,
  EntityRefLinks,
} from '@backstage/plugin-catalog-react';
import { Chip } from '@material-ui/core';
import { CatalogTableRow } from './types';
import { OverflowTooltip, TableColumn } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import { Link } from 'react-router-dom';

// The columnFactories symbol is not directly exported, but through the
// CatalogTable.columns field.
/** @public */
export const columnFactories = Object.freeze({
  createNameColumn(options?: {
    defaultKind?: string;
  }): TableColumn<CatalogTableRow> {
    function formatContent(entity: Entity): string {
      return (
        entity.metadata?.title ||
        humanizeEntityRef(entity, {
          defaultKind: options?.defaultKind,
        })
      );
    }

    return {
      title: 'Name',
      field: 'resolved.name',
      highlight: true,
      customSort({ entity: entity1 }, { entity: entity2 }) {
        // TODO: We could implement this more efficiently by comparing field by field.
        // This has similar issues as above.
        return formatContent(entity1).localeCompare(formatContent(entity2));
      },
      render: ({ entity }) => (
        // Link entity item
        // <EntityRefLink
        //   entityRef={entity}
        //   defaultKind={options?.defaultKind || 'Component'}
        //   title={entity.metadata?.title}
        // />
        <p 
         onClick={()=>{
          localStorage.setItem("annotations", JSON.stringify(entity.metadata.annotations));
          window.location.reload()
          window.location.replace(`${window.location.origin}/catalog/${entity.metadata.namespace??'default'}/${entity.kind}/${entity.metadata.name}`)
         }}
         style={{cursor:'pointer'}}
          >
          {entity.metadata.name}
        </p>
        
      ),
    };
  },
  createSystemColumn(): TableColumn<CatalogTableRow> {
    return {
      title: 'System',
      field: 'resolved.partOfSystemRelationTitle',
      render: ({ resolved }) => (
        <EntityRefLinks
          entityRefs={resolved.partOfSystemRelations}
          defaultKind="system"
        />
      ),
    };
  },
  createOwnerColumn(): TableColumn<CatalogTableRow> {
    return {
      title: 'Owner',
      field: 'resolved.ownedByRelationsTitle',
      render: ({ resolved }) => (
        <EntityRefLinks
          entityRefs={resolved.ownedByRelations}
          defaultKind="group"
        />
      ),
    };
  },
  createSpecTypeColumn(): TableColumn<CatalogTableRow> {
    return {
      title: 'Type',
      field: 'entity.spec.type',
      hidden: true,
    };
  },
  createSpecLifecycleColumn(): TableColumn<CatalogTableRow> {
    return {
      title: 'Lifecycle',
      field: 'entity.spec.lifecycle',
    };
  },
  createMetadataDescriptionColumn(): TableColumn<CatalogTableRow> {
    return {
      title: 'Description',
      field: 'entity.metadata.description',
      render: ({ entity }) => (
        <OverflowTooltip
          text={entity.metadata.description}
          placement="bottom-start"
        />
      ),
      width: 'auto',
    };
  },
  createTagsColumn(): TableColumn<CatalogTableRow> {
    return {
      title: 'Tags',
      field: 'entity.metadata.tags',
      cellStyle: {
        padding: '0px 16px 0px 20px',
      },
      render: ({ entity }) => (
        <>
          {entity.metadata.tags &&
            entity.metadata.tags.map(t => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                style={{ marginBottom: '0px' }}
              />
            ))}
        </>
      ),
    };
  },
});