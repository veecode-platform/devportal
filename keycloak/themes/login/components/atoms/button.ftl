<#macro kw color="" component="button" size="" rest...>
  <#switch color>
    <#case "primary">
      <#assign colorClass="bg-primary-600 text-white focus:ring-primary-600 hover:bg-primary-700">
      <#break>
    <#case "secondary">
      <#assign colorClass="bg-secondary-100 text-secondary-600 focus:ring-secondary-600 hover:bg-secondary-200 hover:text-secondary-900">
      <#break>
    <#default>
      <#assign colorClass="bg-primary-600 text-white focus:ring-primary-600 hover:bg-primary-700">
  </#switch>

  <#switch size>
    <#case "medium">
      <#assign sizeClass="px-4 py-2 text-sm">
      <#break>
    <#case "small">
      <#assign sizeClass="px-2 py-1 text-xs">
      <#break>
    <#default>
      <#assign sizeClass="px-4 py-2 text-sm">
  </#switch>

  <${component}
     style="width: 100%;
                      height: 56px;
                      padding: 1em 0;
                      background: linear-gradient(270deg, #1c8068,#33FFCE );
                      border-radius: .3rem;
                      outline: none;
                      border: 1px solid #33FFCE;
                      margin: 1em 0;
                      cursor: pointer;
                      font-size: 16px;
                      color: #FAFAFA;
                      transition: all 0.8s linear;"

    <#list rest as attrName, attrValue>
      ${attrName}="${attrValue}"
    </#list>
  >
    <#nested>
  </${component}>
</#macro>
