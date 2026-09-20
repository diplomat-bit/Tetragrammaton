/**
 * AUTO-GENERATED AZURE DEPLOYMENT CREDENTIALS VAULT COMPONENT
 * Consolidates all deployment JSONs and credentials into secure React state.
 */
import React, { useState } from 'react';
import { Shield, Key, Database, FileText, CheckCircle, Search, Copy, Check } from 'lucide-react';

export const deploymentVaultData = [
  {
    "filename": "deployment (1).json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Resources/deployments/Microsoft.MachineLearningServices",
      "name": "Microsoft.MachineLearningServices",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/cloud-shell-storage-eastus/providers/Microsoft.MachineLearningServices/workspaces/Now",
        "marketplaceItemId": "Microsoft.MachineLearningServices",
        "provisioningHash": "iwuh-wccbe-tt0-2enb-ioes-849e-tircx-guw6"
      },
      "properties": {
        "templateHash": "5080257549333818093",
        "parameters": {
          "workspaceName": {
            "type": "String",
            "value": "Now"
          },
          "location": {
            "type": "String",
            "value": "centralus"
          },
          "resourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "sku": {
            "type": "String",
            "value": "Basic"
          },
          "identityType": {
            "type": "String",
            "value": "systemAssigned"
          },
          "primaryUserAssignedIdentityResourceGroup": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "primaryUserAssignedIdentityName": {
            "type": "String",
            "value": ""
          },
          "storageAccountOption": {
            "type": "String",
            "value": "new"
          },
          "storageAccountName": {
            "type": "String",
            "value": "now6998242530"
          },
          "storageAccountType": {
            "type": "String",
            "value": "Standard_LRS"
          },
          "storageAccountBehindVNet": {
            "type": "String",
            "value": "false"
          },
          "storageAccountResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "storageAccountLocation": {
            "type": "String",
            "value": "centralus"
          },
          "storageAccountHnsEnabled": {
            "type": "Bool",
            "value": false
          },
          "keyVaultOption": {
            "type": "String",
            "value": "new"
          },
          "keyVaultName": {
            "type": "String",
            "value": "now8675439885"
          },
          "keyVaultBehindVNet": {
            "type": "String",
            "value": "false"
          },
          "keyVaultResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "keyVaultLocation": {
            "type": "String",
            "value": "centralus"
          },
          "applicationInsightsOption": {
            "type": "String",
            "value": "new"
          },
          "applicationInsightsName": {
            "type": "String",
            "value": "now6579198507"
          },
          "applicationInsightsResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "applicationInsightsLocation": {
            "type": "String",
            "value": "centralus"
          },
          "containerRegistryOption": {
            "type": "String",
            "value": "existing"
          },
          "containerRegistryName": {
            "type": "String",
            "value": "Kingjamesbuvelocallaghanthethird"
          },
          "containerRegistrySku": {
            "type": "String",
            "value": "Premium"
          },
          "containerRegistryResourceGroupName": {
            "type": "String",
            "value": "resource-banks-james-burvel-jocall3"
          },
          "containerRegistryBehindVNet": {
            "type": "String",
            "value": "false"
          },
          "containerRegistryLocation": {
            "type": "String",
            "value": "eastus2"
          },
          "vnetOption": {
            "type": "String",
            "value": "none"
          },
          "vnetName": {
            "type": "String",
            "value": "vnej4tnbi4tb7wk"
          },
          "vnetResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "addressPrefixes": {
            "type": "Array",
            "value": [
              "10.0.0.0/16"
            ]
          },
          "subnetOption": {
            "type": "String",
            "value": "none"
          },
          "subnetName": {
            "type": "String",
            "value": "snej4tnbi4tb7wk"
          },
          "subnetPrefix": {
            "type": "String",
            "value": "10.0.0.0/24"
          },
          "adbWorkspace": {
            "type": "String",
            "value": ""
          },
          "confidential_data": {
            "type": "String",
            "value": "false"
          },
          "encryption_status": {
            "type": "String",
            "value": "Disabled"
          },
          "cmk_keyvault": {
            "type": "String",
            "value": ""
          },
          "resource_cmk_uri": {
            "type": "String",
            "value": ""
          },
          "cmk_storageAccountId": {
            "type": "String",
            "value": ""
          },
          "cmk_searchAccountId": {
            "type": "String",
            "value": ""
          },
          "cmk_cosmosDbId": {
            "type": "String",
            "value": ""
          },
          "privateEndpointType": {
            "type": "String",
            "value": "none"
          },
          "tagValues": {
            "type": "Object",
            "value": {}
          },
          "privateEndpointName": {
            "type": "String",
            "value": "pe"
          },
          "privateEndpointResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "privateEndpointSubscription": {
            "type": "String",
            "value": "aba6fac4-db66-4d0c-8bce-e11e744b44df"
          },
          "systemDatastoresAuthMode": {
            "type": "String",
            "value": "accessKey"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-11T19:57:13.3126092Z",
        "duration": "PT3.9818452S",
        "correlationId": "b3e0e28c-4726-487e-a294-d2909b599f27",
        "providers": [
          {
            "namespace": "Microsoft.Storage",
            "resourceTypes": [
              {
                "resourceType": "storageAccounts",
                "locations": [
                  "centralus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.KeyVault",
            "resourceTypes": [
              {
                "resourceType": "vaults",
                "locations": [
                  "centralus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Insights",
            "resourceTypes": [
              {
                "resourceType": "components",
                "locations": [
                  "centralus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.MachineLearningServices",
            "resourceTypes": [
              {
                "resourceType": "workspaces",
                "locations": [
                  "centralus"
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Storage/storageAccounts/now6998242530",
                "resourceType": "Microsoft.Storage/storageAccounts",
                "resourceName": "now6998242530"
              },
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.KeyVault/vaults/now8675439885",
                "resourceType": "Microsoft.KeyVault/vaults",
                "resourceName": "now8675439885"
              },
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Insights/components/now6579198507",
                "resourceType": "Microsoft.Insights/components",
                "resourceName": "now6579198507"
              },
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.ContainerRegistry/registries/Kingjamesbuvelocallaghanthethird",
                "resourceType": "Microsoft.ContainerRegistry/registries",
                "resourceName": "Kingjamesbuvelocallaghanthethird"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.MachineLearningServices/workspaces/Now",
            "resourceType": "Microsoft.MachineLearningServices/workspaces",
            "resourceName": "Now"
          },
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.MachineLearningServices/workspaces/Now",
                "resourceType": "Microsoft.MachineLearningServices/workspaces",
                "resourceName": "Now"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Resources/deployments/DeployPrivateEndpoint-4yxlorfvgucfo",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "DeployPrivateEndpoint-4yxlorfvgucfo"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.231Z"
  },
  {
    "filename": "deployment 10.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/DiskAccess.uyup-20220414022353",
      "name": "DiskAccess.uyup-20220414022353",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Compute/diskAccesses/uyup",
        "marketplaceItemId": "Microsoft.DiskAccess"
      },
      "properties": {
        "templateHash": "2536222611941329053",
        "parameters": {
          "location": {
            "type": "String",
            "value": "eastus2"
          },
          "diskAccessName": {
            "type": "String",
            "value": "uyup"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-14T06:28:27.9307792Z",
        "duration": "PT4M31.8089711S",
        "correlationId": "59cfe9e0-0c3f-4a9b-9864-f872717ec6d1",
        "providers": [
          {
            "namespace": "Microsoft.Compute",
            "resourceTypes": [
              {
                "resourceType": "diskAccesses",
                "locations": [
                  "eastus2"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Compute/diskAccesses/uyup",
                "resourceType": "Microsoft.Compute/diskAccesses",
                "resourceName": "uyup"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/bitcoin_334064ed-31e0-47a3-98ac-60bff9912031",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "bitcoin_334064ed-31e0-47a3-98ac-60bff9912031"
          },
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/bitcoin_334064ed-31e0-47a3-98ac-60bff9912031",
                "resourceType": "Microsoft.Resources/deployments",
                "resourceName": "bitcoin_334064ed-31e0-47a3-98ac-60bff9912031"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Resources/deployments/PrivateDns-334064ed31e047a398ac60bff9912032",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "PrivateDns-334064ed31e047a398ac60bff9912032"
          }
        ],
        "outputs": {},
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Compute/diskAccesses/uyup"
          },
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Network/privateEndpoints/bitcoin"
          },
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Network/privateDnsZones/privatelink.blob.core.windows.net"
          },
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Network/privateDnsZones/privatelink.blob.core.windows.net/A/md-impexp-n3cnxfcghd3f"
          },
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Network/privateDnsZones/privatelink.blob.core.windows.net/virtualNetworkLinks/nwtu2k33a37x4"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.231Z"
  },
  {
    "filename": "deployment 11.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/e4c3c64e-ca6f-463d-aca2-57e2b33173a8",
      "name": "e4c3c64e-ca6f-463d-aca2-57e2b33173a8",
      "type": "Microsoft.Resources/deployments",
      "location": "eastus2",
      "tags": {
        "marketplaceItemId": "servent.servent-azure-hours-bank",
        "provisioningHash": "f9d852e5-4499-4011-856a-a617250c98d6"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "1ca5a6fa-a2c6-4860-9e4e-22d10f07c730"
          },
          "definitionName": {
            "type": "String",
            "value": "Azure Hours Bank Managed Service (Azure Hours Bank Managed Service)"
          },
          "definitionDescription": {
            "type": "String",
            "value": ""
          },
          "managedByTenantId": {
            "type": "String",
            "value": "aa7b14b6-d220-4a6e-8841-4cdb18ab0acc"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "c5850572-d879-4036-af43-1889a03b2876",
                "principalIdDisplayName": "Servent - Subscription - Owners",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "servent"
          },
          "offerId": {
            "type": "String",
            "value": "servent-azure-hours-bank"
          },
          "planId": {
            "type": "String",
            "value": "azure-hours-bank-service-plan"
          },
          "planVersion": {
            "type": "String",
            "value": "0.0.1"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T17:43:29.0949281Z",
        "duration": "PT0.5955784S",
        "correlationId": "1482f1b8-9b70-4e7d-82c2-653313033c4d",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.232Z"
  },
  {
    "filename": "deployment 12.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/e4c3c64e-ca6f-463d-aca2-57e2b33173a8",
      "name": "e4c3c64e-ca6f-463d-aca2-57e2b33173a8",
      "type": "Microsoft.Resources/deployments",
      "location": "eastus2",
      "tags": {
        "marketplaceItemId": "servent.servent-azure-hours-bank",
        "provisioningHash": "f9d852e5-4499-4011-856a-a617250c98d6"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "1ca5a6fa-a2c6-4860-9e4e-22d10f07c730"
          },
          "definitionName": {
            "type": "String",
            "value": "Azure Hours Bank Managed Service (Azure Hours Bank Managed Service)"
          },
          "definitionDescription": {
            "type": "String",
            "value": ""
          },
          "managedByTenantId": {
            "type": "String",
            "value": "aa7b14b6-d220-4a6e-8841-4cdb18ab0acc"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "c5850572-d879-4036-af43-1889a03b2876",
                "principalIdDisplayName": "Servent - Subscription - Owners",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "servent"
          },
          "offerId": {
            "type": "String",
            "value": "servent-azure-hours-bank"
          },
          "planId": {
            "type": "String",
            "value": "azure-hours-bank-service-plan"
          },
          "planVersion": {
            "type": "String",
            "value": "0.0.1"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T17:43:29.0949281Z",
        "duration": "PT0.5955784S",
        "correlationId": "1482f1b8-9b70-4e7d-82c2-653313033c4d",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.232Z"
  },
  {
    "filename": "deployment 13.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/EftProcessing/providers/Microsoft.Resources/deployments/Microsoft.AzureMonitorPrivateLinkScope",
      "name": "Microsoft.AzureMonitorPrivateLinkScope",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/EftProcessing/providers/microsoft.insights/privatelinkscopes/AzureMonitoring",
        "marketplaceItemId": "Microsoft.AzureMonitorPrivateLinkScope"
      },
      "properties": {
        "templateHash": "9300970246001229532",
        "parameters": {
          "name": {
            "type": "String",
            "value": "AzureMonitoring"
          },
          "tagsArray": {
            "type": "Object",
            "value": {
              "tracking": "ece2817a-13c3-4202-83ae-1269b569940"
            }
          },
          "queryAccessMode": {
            "type": "String",
            "value": "Open"
          },
          "ingestionAccessMode": {
            "type": "String",
            "value": "Open"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-18T01:56:55.1741053Z",
        "duration": "PT0.8115719S",
        "correlationId": "7c45f8de-3a65-4790-952a-7b4c6bcf7a8a",
        "providers": [
          {
            "namespace": "microsoft.insights",
            "resourceTypes": [
              {
                "resourceType": "privatelinkscopes",
                "locations": [
                  "global"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.232Z"
  },
  {
    "filename": "deployment 14.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/Microsoft.PrivateEndpoint-20220414022852",
      "name": "Microsoft.PrivateEndpoint-20220414022852",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/bit4566455_group/providers/Microsoft.Network/privateEndpoints/Endpoint",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "14261109319043745448",
        "parameters": {
          "location": {
            "type": "String",
            "value": "centralus"
          },
          "privateEndpointName": {
            "type": "String",
            "value": "Endpoint"
          },
          "privateLinkResource": {
            "type": "String",
            "value": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Compute/diskAccesses/uyup"
          },
          "targetSubResource": {
            "type": "Array",
            "value": [
              "disks"
            ]
          },
          "requestMessage": {
            "type": "String",
            "value": ""
          },
          "subnet": {
            "type": "String",
            "value": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Network/virtualNetworks/Jopbet_group-vnet/subnets/Citibank"
          },
          "virtualNetworkId": {
            "type": "String",
            "value": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Network/virtualNetworks/Jopbet_group-vnet"
          },
          "virtualNetworkResourceGroup": {
            "type": "String",
            "value": "Jopbet_group"
          },
          "subnetDeploymentName": {
            "type": "String",
            "value": "UpdateSubnetDeployment-20220414023012"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-14T06:30:15.8543566Z",
        "duration": "PT0.4603747S",
        "correlationId": "da1f0c3e-acf6-469c-9ca2-9c5ea9cbfd8d",
        "providers": [
          {
            "namespace": "Microsoft.Network",
            "resourceTypes": [
              {
                "resourceType": "privateEndpoints",
                "locations": [
                  "centralus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Network/privateEndpoints/Endpoint",
                "resourceType": "Microsoft.Network/privateEndpoints",
                "resourceName": "Endpoint"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/DnsZoneGroup-20220414023013",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "DnsZoneGroup-20220414023013"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.232Z"
  },
  {
    "filename": "deployment 15.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Resources/deployments/NoMarketplace-20220417041341512",
      "name": "NoMarketplace-20220417041341512",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "5923482985778363713",
        "parameters": {
          "dnsZonesName": {
            "type": "String",
            "value": "13.appglobal.org"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T04:13:46.9194077Z",
        "duration": "PT0.4398598S",
        "correlationId": "34ae14d1-8662-4398-826e-989b7a2f269e",
        "providers": [
          {
            "namespace": "Microsoft.Network",
            "resourceTypes": [
              {
                "resourceType": "dnsZones",
                "locations": [
                  "global"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
                "resourceType": "Microsoft.Network/dnsZones",
                "resourceName": "13.appglobal.org"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/joy_group/providers/Microsoft.Resources/deployments/NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.232Z"
  },
  {
    "filename": "deployment 16.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427",
      "name": "NoMarketplace-Portal-jimmythakidd-1649466724427",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "122440889602753281",
        "parameters": {
          "name": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "location": {
            "type": "String",
            "value": "eastus"
          },
          "mediaServicesTags": {
            "type": "Object",
            "value": {}
          },
          "storageName": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "storageType": {
            "type": "String",
            "value": "Standard_LRS"
          },
          "storageKind": {
            "type": "String",
            "value": "StorageV2"
          },
          "storageTags": {
            "type": "Object",
            "value": {}
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-09T01:12:42.5371334Z",
        "duration": "PT1.0715655S",
        "correlationId": "b0b83e66-206a-4c66-b075-7944acfb8531",
        "providers": [
          {
            "namespace": "Microsoft.Media",
            "resourceTypes": [
              {
                "resourceType": "mediaservices",
                "locations": [
                  "eastus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
                "resourceType": "Microsoft.Resources/deployments",
                "resourceName": "deploy-storage-and-identity-jimmythakidd"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
            "resourceType": "Microsoft.Media/mediaservices",
            "resourceName": "jimmythakidd"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.232Z"
  },
  {
    "filename": "deployment 17.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/Microsoft.AppConfiguration-20220416200304-5132",
      "name": "Microsoft.AppConfiguration-20220416200304-5132",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.AppConfiguration/configurationStores/Verification",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "1214290023704514501",
        "parameters": {
          "name": {
            "type": "String",
            "value": "Verification"
          },
          "location": {
            "type": "String",
            "value": "centralus"
          },
          "apiVersion": {
            "type": "String",
            "value": "2021-10-01-preview"
          },
          "sku": {
            "type": "String",
            "value": "standard"
          },
          "tags": {
            "type": "Object",
            "value": {
              "tracking": "ece2817a-13c3-4202-83ae-1269b569940"
            }
          },
          "softDeleteRetentionInDays": {
            "type": "Int",
            "value": 7
          },
          "enablePurgeProtection": {
            "type": "Bool",
            "value": false
          },
          "publicNetworkAccess": {
            "type": "String",
            "value": "enabled"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T00:03:15.9054211Z",
        "duration": "PT1.7325571S",
        "correlationId": "b1c004cb-f98d-4e50-83b4-cbc2fe712887",
        "providers": [
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.AppConfiguration",
            "resourceTypes": [
              {
                "resourceType": "configurationStores",
                "locations": [
                  "centralus"
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Resources/deployments/Jopbet_group-vnet_a2104778-dfdb-4c91-8ce9-eb654e491022",
                "resourceType": "Microsoft.Resources/deployments",
                "resourceName": "Jopbet_group-vnet_a2104778-dfdb-4c91-8ce9-eb654e491022"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.AppConfiguration/configurationStores/Verification",
            "resourceType": "Microsoft.AppConfiguration/configurationStores",
            "resourceName": "Verification"
          },
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.AppConfiguration/configurationStores/Verification",
                "resourceType": "Microsoft.AppConfiguration/configurationStores",
                "resourceName": "Verification"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/Privateendpoindsprin_a2104778-dfdb-4c91-8ce9-eb654e491023",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "Privateendpoindsprin_a2104778-dfdb-4c91-8ce9-eb654e491023"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.233Z"
  },
  {
    "filename": "deployment 18.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/e4c3c64e-ca6f-463d-aca2-57e2b33173a8",
      "name": "e4c3c64e-ca6f-463d-aca2-57e2b33173a8",
      "type": "Microsoft.Resources/deployments",
      "location": "eastus2",
      "tags": {
        "marketplaceItemId": "servent.servent-azure-hours-bank",
        "provisioningHash": "f9d852e5-4499-4011-856a-a617250c98d6"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "1ca5a6fa-a2c6-4860-9e4e-22d10f07c730"
          },
          "definitionName": {
            "type": "String",
            "value": "Azure Hours Bank Managed Service (Azure Hours Bank Managed Service)"
          },
          "definitionDescription": {
            "type": "String",
            "value": ""
          },
          "managedByTenantId": {
            "type": "String",
            "value": "aa7b14b6-d220-4a6e-8841-4cdb18ab0acc"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "c5850572-d879-4036-af43-1889a03b2876",
                "principalIdDisplayName": "Servent - Subscription - Owners",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "servent"
          },
          "offerId": {
            "type": "String",
            "value": "servent-azure-hours-bank"
          },
          "planId": {
            "type": "String",
            "value": "azure-hours-bank-service-plan"
          },
          "planVersion": {
            "type": "String",
            "value": "0.0.1"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T17:43:29.0949281Z",
        "duration": "PT0.5955784S",
        "correlationId": "1482f1b8-9b70-4e7d-82c2-653313033c4d",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.233Z"
  },
  {
    "filename": "deployment 19.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Resources/deployments/Microsoft.CloudNativeTesting1650034785129",
      "name": "Microsoft.CloudNativeTesting1650034785129",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/cloud-shell-storage-eastus/providers/Microsoft.LoadTestService/loadtests/Included",
        "marketplaceItemId": "Microsoft.CloudNativeTesting"
      },
      "properties": {
        "templateHash": "16552053850702395745",
        "parameters": {
          "name": {
            "type": "String",
            "value": "Included"
          },
          "location": {
            "type": "String",
            "value": "eastus"
          },
          "tags": {
            "type": "Object",
            "value": {
              "aks-managed-cluster-name": "calmstone-56887883",
              "tracking": "ece2817a-13c3-4202-83ae-1269b569940"
            }
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-15T15:00:06.5062979Z",
        "duration": "PT18.771681S",
        "correlationId": "0d3546fc-ee4c-434f-ab12-221d29306246",
        "providers": [
          {
            "namespace": "Microsoft.LoadTestService",
            "resourceTypes": [
              {
                "resourceType": "loadtests",
                "locations": [
                  "eastus"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.LoadTestService/loadtests/Included"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.233Z"
  },
  {
    "filename": "deployment 2.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/6b721c6a-579e-44b5-9ecd-31d9bcfbea81",
      "name": "6b721c6a-579e-44b5-9ecd-31d9bcfbea81",
      "type": "Microsoft.Resources/deployments",
      "location": "eastus",
      "tags": {
        "marketplaceItemId": "360.360-azure-managed-services360-visibility-managed-cloud",
        "provisioningHash": "eebeca50-4bfa-46a5-8c57-b997683deb0b"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "4905b6e4-e5b8-4a87-b65f-4ffd77ebd2a3"
          },
          "definitionName": {
            "type": "String",
            "value": "360 Azure Cloud Managed Services (Azure Managed Services)"
          },
          "definitionDescription": {
            "type": "String",
            "value": "We are the future separately and together. Complete I disregarded trust to utterly depend on each other to make it the future that we can all togetherly stand "
          },
          "managedByTenantId": {
            "type": "String",
            "value": "0815a0a6-21fd-4467-a0ad-296bc115d5f2"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "3a641d69-8365-4604-a5dc-442ddb150c19",
                "principalIdDisplayName": "360 Managed Services",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "360"
          },
          "offerId": {
            "type": "String",
            "value": "360-azure-managed-services"
          },
          "planId": {
            "type": "String",
            "value": "360-visibility-managed-cloud"
          },
          "planVersion": {
            "type": "String",
            "value": "1.0.0"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-18T03:43:28.4731616Z",
        "duration": "PT0.3972062S",
        "correlationId": "f1835ace-fedc-48c4-8f50-5622de787492",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.233Z"
  },
  {
    "filename": "deployment 20.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Billioniotassets/providers/Microsoft.Resources/deployments/Microsoft.ContainerInstances-20220414042336",
      "name": "Microsoft.ContainerInstances-20220414042336",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/Billioniotassets/providers/Microsoft.ContainerInstance/containerGroups/cntainer",
        "marketplaceItemId": "Microsoft.ContainerInstances"
      },
      "properties": {
        "templateHash": "13583174118150460419",
        "parameters": {
          "availabilityZones": {
            "type": "Array",
            "value": []
          },
          "location": {
            "type": "String",
            "value": "eastus"
          },
          "containerName": {
            "type": "String",
            "value": "cntainer"
          },
          "imageType": {
            "type": "String",
            "value": "Public"
          },
          "imageName": {
            "type": "String",
            "value": "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
          },
          "osType": {
            "type": "String",
            "value": "Linux"
          },
          "numberCpuCores": {
            "type": "String",
            "value": "1"
          },
          "memory": {
            "type": "String",
            "value": "1.5"
          },
          "restartPolicy": {
            "type": "String",
            "value": "OnFailure"
          },
          "environmentVariable0": {
            "type": "SecureString"
          },
          "environmentVariable1": {
            "type": "String",
            "value": "Liars"
          },
          "commandOverrideArray": {
            "type": "Array",
            "value": [
              "/bin/bash",
              "-c",
              "echo hello; sleep 100000"
            ]
          },
          "ipAddressType": {
            "type": "String",
            "value": "Public"
          },
          "ports": {
            "type": "Array",
            "value": [
              {
                "port": "80",
                "protocol": "TCP"
              },
              {
                "port": "2",
                "protocol": "UDP"
              },
              {
                "port": "432",
                "protocol": "TCP"
              },
              {
                "port": "666",
                "protocol": "UDP"
              },
              {
                "port": "22222",
                "protocol": "TCP"
              }
            ]
          },
          "dnsNameLabel": {
            "type": "String",
            "value": "jumpo541"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-14T10:00:28.6063058Z",
        "duration": "PT23.5119758S",
        "correlationId": "48e88ced-1a8b-481d-ab1c-c4c1b9e8bd6b",
        "providers": [
          {
            "namespace": "Microsoft.ContainerInstance",
            "resourceTypes": [
              {
                "resourceType": "containerGroups",
                "locations": [
                  "eastus"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.233Z"
  },
  {
    "filename": "deployment 21.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Resources/deployments/Microsoft.EventHubCluster",
      "name": "Microsoft.EventHubCluster",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.EventHub/clusters/ClusterFunker",
        "marketplaceItemId": "Microsoft.EventHubCluster"
      },
      "properties": {
        "templateHash": "15846709424479992304",
        "parameters": {
          "name": {
            "type": "String",
            "value": "ClusterFunker"
          },
          "location": {
            "type": "String",
            "value": "eastus2"
          },
          "skuName": {
            "type": "String",
            "value": "Dedicated"
          },
          "skuTier": {
            "type": "String",
            "value": "Dedicated"
          },
          "skuCapacity": {
            "type": "String",
            "value": "1"
          },
          "tags": {
            "type": "Object",
            "value": {
              "tracking": "Tracking "
            }
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T03:09:32.246163Z",
        "duration": "PT0.2356759S",
        "correlationId": "cc60fb12-940a-4f2f-b6c0-84e5a0233040",
        "providers": [
          {
            "namespace": "Microsoft.EventHub",
            "resourceTypes": [
              {
                "resourceType": "clusters",
                "locations": [
                  "eastus2"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 22.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427",
      "name": "NoMarketplace-Portal-jimmythakidd-1649466724427",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "122440889602753281",
        "parameters": {
          "name": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "location": {
            "type": "String",
            "value": "eastus"
          },
          "mediaServicesTags": {
            "type": "Object",
            "value": {}
          },
          "storageName": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "storageType": {
            "type": "String",
            "value": "Standard_LRS"
          },
          "storageKind": {
            "type": "String",
            "value": "StorageV2"
          },
          "storageTags": {
            "type": "Object",
            "value": {}
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-09T01:13:14.3975856Z",
        "duration": "PT32.9320177S",
        "correlationId": "b0b83e66-206a-4c66-b075-7944acfb8531",
        "providers": [
          {
            "namespace": "Microsoft.Media",
            "resourceTypes": [
              {
                "resourceType": "mediaservices",
                "locations": [
                  "eastus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
                "resourceType": "Microsoft.Resources/deployments",
                "resourceName": "deploy-storage-and-identity-jimmythakidd"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
            "resourceType": "Microsoft.Media/mediaservices",
            "resourceName": "jimmythakidd"
          }
        ],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd"
          },
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/microsoft.storage/storageaccounts/jimmythakidd"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 23.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/Microsoft.Web-AppServiceCertificates-Portal-2fc7cea6-8138",
      "name": "Microsoft.Web-AppServiceCertificates-Portal-2fc7cea6-8138",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.CertificateRegistration/certificateOrders/cacert",
        "marketplaceItemId": "Microsoft.SSL"
      },
      "properties": {
        "templateHash": "9621435308307780773",
        "parameters": {
          "subscriptionId": {
            "type": "String",
            "value": "aba6fac4-db66-4d0c-8bce-e11e744b44df"
          },
          "resourceGroup": {
            "type": "String",
            "value": "spring-boot-complete-1649734694672-rg"
          },
          "certificateOrderName": {
            "type": "String",
            "value": "cacert"
          },
          "distinguishedName": {
            "type": "String",
            "value": "CN=*.yourdomain.com"
          },
          "productType": {
            "type": "String",
            "value": "StandardDomainValidatedWildCardSsl"
          },
          "autoRenew": {
            "type": "Bool",
            "value": true
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-17T03:35:41.7452728Z",
        "duration": "PT24.1272871S",
        "correlationId": "52600192-77f7-4c56-b2d7-d84223e23623",
        "providers": [
          {
            "namespace": "Microsoft.CertificateRegistration",
            "resourceTypes": [
              {
                "resourceType": "certificateOrders",
                "locations": [
                  "global"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.CertificateRegistration/certificateOrders/cacert"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 24.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/IOTC/providers/Microsoft.Resources/deployments/Microsoft.Web-StaticApp-Portal-28ff135d-b05f",
      "name": "Microsoft.Web-StaticApp-Portal-28ff135d-b05f",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/IOTC/providers/Microsoft.Web/staticSites/StatiC",
        "marketplaceItemId": "Microsoft.StaticApp"
      },
      "properties": {
        "templateHash": "11212954121191258803",
        "parameters": {
          "name": {
            "type": "String",
            "value": "StatiC"
          },
          "location": {
            "type": "String",
            "value": "centralus"
          },
          "sku": {
            "type": "String",
            "value": "Standard"
          },
          "skucode": {
            "type": "String",
            "value": "Standard"
          },
          "repositoryUrl": {
            "type": "String",
            "value": "https://github.com/jocall3/king"
          },
          "branch": {
            "type": "String",
            "value": "Master"
          },
          "repositoryToken": {
            "type": "SecureString"
          },
          "appLocation": {
            "type": "String",
            "value": "/"
          },
          "apiLocation": {
            "type": "String",
            "value": ""
          },
          "appArtifactLocation": {
            "type": "String",
            "value": ""
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-15T05:37:26.1790415Z",
        "duration": "PT5.5608743S",
        "correlationId": "1eb5cba6-bf97-426f-9cb2-91798601a237",
        "providers": [
          {
            "namespace": "Microsoft.Web",
            "resourceTypes": [
              {
                "resourceType": "staticSites",
                "locations": [
                  "centralus"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/IOTC/providers/Microsoft.Web/staticSites/StatiC"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 25.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Resources/deployments/NoMarketplace-20220417041341512",
      "name": "NoMarketplace-20220417041341512",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "5923482985778363713",
        "parameters": {
          "dnsZonesName": {
            "type": "String",
            "value": "13.appglobal.org"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T04:13:46.9194077Z",
        "duration": "PT0.4398598S",
        "correlationId": "34ae14d1-8662-4398-826e-989b7a2f269e",
        "providers": [
          {
            "namespace": "Microsoft.Network",
            "resourceTypes": [
              {
                "resourceType": "dnsZones",
                "locations": [
                  "global"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
                "resourceType": "Microsoft.Network/dnsZones",
                "resourceName": "13.appglobal.org"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/joy_group/providers/Microsoft.Resources/deployments/NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 26.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Resources/deployments/NoMarketplace-20220417041341512",
      "name": "NoMarketplace-20220417041341512",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "5923482985778363713",
        "parameters": {
          "dnsZonesName": {
            "type": "String",
            "value": "13.appglobal.org"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T04:13:46.9194077Z",
        "duration": "PT0.4398598S",
        "correlationId": "34ae14d1-8662-4398-826e-989b7a2f269e",
        "providers": [
          {
            "namespace": "Microsoft.Network",
            "resourceTypes": [
              {
                "resourceType": "dnsZones",
                "locations": [
                  "global"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
                "resourceType": "Microsoft.Network/dnsZones",
                "resourceName": "13.appglobal.org"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/joy_group/providers/Microsoft.Resources/deployments/NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 27.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Resources/deployments/NoMarketplace-20220417041341512",
      "name": "NoMarketplace-20220417041341512",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "5923482985778363713",
        "parameters": {
          "dnsZonesName": {
            "type": "String",
            "value": "13.appglobal.org"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T04:13:46.9194077Z",
        "duration": "PT0.4398598S",
        "correlationId": "34ae14d1-8662-4398-826e-989b7a2f269e",
        "providers": [
          {
            "namespace": "Microsoft.Network",
            "resourceTypes": [
              {
                "resourceType": "dnsZones",
                "locations": [
                  "global"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
                "resourceType": "Microsoft.Network/dnsZones",
                "resourceName": "13.appglobal.org"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/joy_group/providers/Microsoft.Resources/deployments/NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 28.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Resources/deployments/NoMarketplace-20220417041341512",
      "name": "NoMarketplace-20220417041341512",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "5923482985778363713",
        "parameters": {
          "dnsZonesName": {
            "type": "String",
            "value": "13.appglobal.org"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-17T04:13:46.9194077Z",
        "duration": "PT0.4398598S",
        "correlationId": "34ae14d1-8662-4398-826e-989b7a2f269e",
        "providers": [
          {
            "namespace": "Microsoft.Network",
            "resourceTypes": [
              {
                "resourceType": "dnsZones",
                "locations": [
                  "global"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/13-rg/providers/Microsoft.Network/dnsZones/13.appglobal.org",
                "resourceType": "Microsoft.Network/dnsZones",
                "resourceName": "13.appglobal.org"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/joy_group/providers/Microsoft.Resources/deployments/NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "NameServerDelegation-e2537f5be2a44b93b2d5c0051cdaf025"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 29.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427",
      "name": "NoMarketplace-Portal-jimmythakidd-1649466724427",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "122440889602753281",
        "parameters": {
          "name": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "location": {
            "type": "String",
            "value": "eastus"
          },
          "mediaServicesTags": {
            "type": "Object",
            "value": {}
          },
          "storageName": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "storageType": {
            "type": "String",
            "value": "Standard_LRS"
          },
          "storageKind": {
            "type": "String",
            "value": "StorageV2"
          },
          "storageTags": {
            "type": "Object",
            "value": {}
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-09T01:12:42.5371334Z",
        "duration": "PT1.0715655S",
        "correlationId": "b0b83e66-206a-4c66-b075-7944acfb8531",
        "providers": [
          {
            "namespace": "Microsoft.Media",
            "resourceTypes": [
              {
                "resourceType": "mediaservices",
                "locations": [
                  "eastus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
                "resourceType": "Microsoft.Resources/deployments",
                "resourceName": "deploy-storage-and-identity-jimmythakidd"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
            "resourceType": "Microsoft.Media/mediaservices",
            "resourceName": "jimmythakidd"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.234Z"
  },
  {
    "filename": "deployment 3.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/8a19f858-0142-460a-8c9c-ac12589c176b",
      "name": "8a19f858-0142-460a-8c9c-ac12589c176b",
      "type": "Microsoft.Resources/deployments",
      "location": "ukwest",
      "tags": {
        "marketplaceItemId": "allieddigitalservicesllc1589910062052.rimmrimm-tier3",
        "provisioningHash": "612bf8a2-6795-4e12-af02-d9b1eda42346"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "10aaa325-8167-4d39-86fc-99d91901c0fe"
          },
          "definitionName": {
            "type": "String",
            "value": "Remote Infrastructure Monitoring and Management (Tier 3: Administration of Azure Infrastructure)"
          },
          "definitionDescription": {
            "type": "String",
            "value": ""
          },
          "managedByTenantId": {
            "type": "String",
            "value": "2f46c040-48e3-4eb8-8fbf-418417f64401"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "3a152b6a-8902-4447-a929-cb7bbe5acf11",
                "principalIdDisplayName": "Justin Grote",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "allieddigitalservicesllc1589910062052"
          },
          "offerId": {
            "type": "String",
            "value": "rimm"
          },
          "planId": {
            "type": "String",
            "value": "rimm-tier3"
          },
          "planVersion": {
            "type": "String",
            "value": "0.0.1"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-16T06:45:58.1487003Z",
        "duration": "PT3.9725914S",
        "correlationId": "14947c85-57bc-4b26-8a27-fc4083902a5c",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/10aaa325-8167-4d39-86fc-99d91901c0fe"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment 30.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427",
      "name": "NoMarketplace-Portal-jimmythakidd-1649466724427",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "122440889602753281",
        "parameters": {
          "name": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "location": {
            "type": "String",
            "value": "eastus"
          },
          "mediaServicesTags": {
            "type": "Object",
            "value": {}
          },
          "storageName": {
            "type": "String",
            "value": "jimmythakidd"
          },
          "storageType": {
            "type": "String",
            "value": "Standard_LRS"
          },
          "storageKind": {
            "type": "String",
            "value": "StorageV2"
          },
          "storageTags": {
            "type": "Object",
            "value": {}
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-09T01:12:42.5371334Z",
        "duration": "PT1.0715655S",
        "correlationId": "b0b83e66-206a-4c66-b075-7944acfb8531",
        "providers": [
          {
            "namespace": "Microsoft.Media",
            "resourceTypes": [
              {
                "resourceType": "mediaservices",
                "locations": [
                  "eastus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Resources",
            "resourceTypes": [
              {
                "resourceType": "deployments",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
                "resourceType": "Microsoft.Resources/deployments",
                "resourceName": "deploy-storage-and-identity-jimmythakidd"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
            "resourceType": "Microsoft.Media/mediaservices",
            "resourceName": "jimmythakidd"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment 4.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/8a19f858-0142-460a-8c9c-ac12589c176b",
      "name": "8a19f858-0142-460a-8c9c-ac12589c176b",
      "type": "Microsoft.Resources/deployments",
      "location": "ukwest",
      "tags": {
        "marketplaceItemId": "allieddigitalservicesllc1589910062052.rimmrimm-tier3",
        "provisioningHash": "612bf8a2-6795-4e12-af02-d9b1eda42346"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "10aaa325-8167-4d39-86fc-99d91901c0fe"
          },
          "definitionName": {
            "type": "String",
            "value": "Remote Infrastructure Monitoring and Management (Tier 3: Administration of Azure Infrastructure)"
          },
          "definitionDescription": {
            "type": "String",
            "value": ""
          },
          "managedByTenantId": {
            "type": "String",
            "value": "2f46c040-48e3-4eb8-8fbf-418417f64401"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "3a152b6a-8902-4447-a929-cb7bbe5acf11",
                "principalIdDisplayName": "Justin Grote",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "allieddigitalservicesllc1589910062052"
          },
          "offerId": {
            "type": "String",
            "value": "rimm"
          },
          "planId": {
            "type": "String",
            "value": "rimm-tier3"
          },
          "planVersion": {
            "type": "String",
            "value": "0.0.1"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-16T06:45:58.1487003Z",
        "duration": "PT3.9725914S",
        "correlationId": "14947c85-57bc-4b26-8a27-fc4083902a5c",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/10aaa325-8167-4d39-86fc-99d91901c0fe"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment 5.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/47c223d3-031f-4566-b4d7-26befa20c529",
      "name": "47c223d3-031f-4566-b4d7-26befa20c529",
      "type": "Microsoft.Resources/deployments",
      "location": "centralus",
      "tags": {
        "marketplaceItemId": "servent.servent-azure-hours-bank",
        "provisioningHash": "fd5f86d9-bc92-4ef4-9aa1-38f880348549"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "caa22925-a776-49db-af60-1a2189d0132e"
          },
          "definitionName": {
            "type": "String",
            "value": "The Bank "
          },
          "definitionDescription": {
            "type": "String",
            "value": "Everybody goes to the bank by Tony Montana"
          },
          "managedByTenantId": {
            "type": "String",
            "value": "aa7b14b6-d220-4a6e-8841-4cdb18ab0acc"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "c5850572-d879-4036-af43-1889a03b2876",
                "principalIdDisplayName": "Servent - Subscription - Owners",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "servent"
          },
          "offerId": {
            "type": "String",
            "value": "servent-azure-hours-bank"
          },
          "planId": {
            "type": "String",
            "value": "azure-hours-bank-service-plan"
          },
          "planVersion": {
            "type": "String",
            "value": "0.0.1"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-16T01:44:46.5773636Z",
        "duration": "PT2.8790401S",
        "correlationId": "344861e7-7e3c-4ba0-8144-32cc6cc0fe2f",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/caa22925-a776-49db-af60-1a2189d0132e"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment 6.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/325bca1a-e00b-428c-bfc7-11908387320f",
      "name": "325bca1a-e00b-428c-bfc7-11908387320f",
      "type": "Microsoft.Resources/deployments",
      "location": "ukwest",
      "tags": {
        "marketplaceItemId": "servent.servent-azure-hours-bank",
        "provisioningHash": "81208e2a-7695-4355-8b6d-84531e09f386"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "933ba491-578b-41a9-b7e7-cb41d780702b"
          },
          "definitionName": {
            "type": "String",
            "value": "Azure Hours Bank Managed Service (Azure Hours Bank Managed Service)"
          },
          "definitionDescription": {
            "type": "String",
            "value": ""
          },
          "managedByTenantId": {
            "type": "String",
            "value": "aa7b14b6-d220-4a6e-8841-4cdb18ab0acc"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "c5850572-d879-4036-af43-1889a03b2876",
                "principalIdDisplayName": "Servent - Subscription - Owners",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "servent"
          },
          "offerId": {
            "type": "String",
            "value": "servent-azure-hours-bank"
          },
          "planId": {
            "type": "String",
            "value": "azure-hours-bank-service-plan"
          },
          "planVersion": {
            "type": "String",
            "value": "0.0.1"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-19T18:49:40.8271083Z",
        "duration": "PT5.4343877S",
        "correlationId": "dd866a45-e871-48f3-bf38-dbc5da0a8451",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/933ba491-578b-41a9-b7e7-cb41d780702b"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment 7.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/770c1cea-2a4e-43b1-beb5-a92f2bc0632f",
      "name": "770c1cea-2a4e-43b1-beb5-a92f2bc0632f",
      "type": "Microsoft.Resources/deployments",
      "location": "centralus",
      "tags": {
        "marketplaceItemId": "wipro-ltd.wipro_azure_ad_iam",
        "provisioningHash": "03bda17e-d3aa-4385-b468-d84fd3511b8a"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "90f1322f-63fd-4be8-b0e5-0ad6858cc4b8"
          },
          "definitionName": {
            "type": "String",
            "value": "Azure AD Digital IAM Managed Service (Per IAM App)"
          },
          "definitionDescription": {
            "type": "String",
            "value": "Super User Admin no restrictions whatsoever "
          },
          "managedByTenantId": {
            "type": "String",
            "value": "c1d91f8d-b889-4794-9127-3d00a3bfd2fc"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "06273c13-49b9-413d-b5e2-ec786b0a8a37",
                "principalIdDisplayName": "MSSP Admin",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "wipro-ltd"
          },
          "offerId": {
            "type": "String",
            "value": "wipro_azure_ad_iam"
          },
          "planId": {
            "type": "String",
            "value": "perapp"
          },
          "planVersion": {
            "type": "String",
            "value": "1.0.0"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-14T20:55:08.1836384Z",
        "duration": "PT4.5215755S",
        "correlationId": "01e96095-de4a-4d56-a683-4aab973c5d7f",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/90f1322f-63fd-4be8-b0e5-0ad6858cc4b8"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment 8.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/AzureQuantum/providers/Microsoft.Resources/deployments/CreateRemoteRenderingForm_dx-20220407055841",
      "name": "CreateRemoteRenderingForm_dx-20220407055841",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "marketplaceItemId": ""
      },
      "properties": {
        "templateHash": "4753133538392915180",
        "parameters": {
          "name": {
            "type": "String",
            "value": "Autog"
          },
          "location": {
            "type": "String",
            "value": "eastus"
          },
          "tagsByResource": {
            "type": "Object",
            "value": {
              "Microsoft.MixedReality/remoteRenderingAccounts": {
                "tracking": "ece2817a-13c3-4202-83ae-1269b569940"
              }
            }
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-07T09:59:46.2683954Z",
        "duration": "PT0.2235892S",
        "correlationId": "156ba523-5069-4579-b274-6aa6965ef896",
        "providers": [
          {
            "namespace": "Microsoft.MixedReality",
            "resourceTypes": [
              {
                "resourceType": "remoteRenderingAccounts",
                "locations": [
                  "eastus"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment 9.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/VstsRG-13-6add/providers/Microsoft.Resources/deployments/Deploy_DevOps_Project_13",
      "name": "Deploy_DevOps_Project_13",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/VstsRG-13-6add/providers/Microsoft.DevOps/pipelines/13",
        "marketplaceItemId": "Microsoft.AzureProject"
      },
      "properties": {
        "templateHash": "16147331635188201868",
        "parameters": {
          "azureAuth": {
            "type": "SecureString"
          },
          "repository_auth": {
            "type": "SecureObject"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Succeeded",
        "timestamp": "2022-04-10T03:24:04.1389416Z",
        "duration": "PT10.9746895S",
        "correlationId": "280c5443-fdcf-4b6d-aa98-cb51a9753a41",
        "providers": [
          {
            "namespace": "Microsoft.DevOps",
            "resourceTypes": [
              {
                "resourceType": "pipelines",
                "locations": [
                  "centralus"
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "outputResources": [
          {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/VstsRG-13-6add/providers/Microsoft.DevOps/pipelines/13"
          }
        ]
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment.json",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/6b721c6a-579e-44b5-9ecd-31d9bcfbea81",
      "name": "6b721c6a-579e-44b5-9ecd-31d9bcfbea81",
      "type": "Microsoft.Resources/deployments",
      "location": "eastus",
      "tags": {
        "marketplaceItemId": "360.360-azure-managed-services360-visibility-managed-cloud",
        "provisioningHash": "eebeca50-4bfa-46a5-8c57-b997683deb0b"
      },
      "properties": {
        "templateHash": "9066690161837384525",
        "parameters": {
          "name": {
            "type": "String",
            "value": "4905b6e4-e5b8-4a87-b65f-4ffd77ebd2a3"
          },
          "definitionName": {
            "type": "String",
            "value": "360 Azure Cloud Managed Services (Azure Managed Services)"
          },
          "definitionDescription": {
            "type": "String",
            "value": "We are the future separately and together. Complete I disregarded trust to utterly depend on each other to make it the future that we can all togetherly stand "
          },
          "managedByTenantId": {
            "type": "String",
            "value": "0815a0a6-21fd-4467-a0ad-296bc115d5f2"
          },
          "authorizations": {
            "type": "Array",
            "value": [
              {
                "principalId": "3a641d69-8365-4604-a5dc-442ddb150c19",
                "principalIdDisplayName": "360 Managed Services",
                "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
                "delegatedRoleDefinitionIds": []
              }
            ]
          },
          "eligibleAuthorizations": {
            "type": "Array",
            "value": []
          },
          "publisherId": {
            "type": "String",
            "value": "360"
          },
          "offerId": {
            "type": "String",
            "value": "360-azure-managed-services"
          },
          "planId": {
            "type": "String",
            "value": "360-visibility-managed-cloud"
          },
          "planVersion": {
            "type": "String",
            "value": "1.0.0"
          },
          "apiVersion": {
            "type": "String",
            "value": "2020-02-01-preview"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-18T03:43:28.4731616Z",
        "duration": "PT0.3972062S",
        "correlationId": "f1835ace-fedc-48c4-8f50-5622de787492",
        "providers": [
          {
            "namespace": "Microsoft.ManagedServices",
            "resourceTypes": [
              {
                "resourceType": "registrationDefinitions",
                "locations": [
                  null
                ]
              }
            ]
          }
        ],
        "dependencies": [],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment.json.txt",
    "data": {
      "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Resources/deployments/Microsoft.MachineLearningServices",
      "name": "Microsoft.MachineLearningServices",
      "type": "Microsoft.Resources/deployments",
      "tags": {
        "primaryResourceId": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourcegroups/cloud-shell-storage-eastus/providers/Microsoft.MachineLearningServices/workspaces/Now",
        "marketplaceItemId": "Microsoft.MachineLearningServices",
        "provisioningHash": "iwuh-wccbe-tt0-2enb-ioes-849e-tircx-guw6"
      },
      "properties": {
        "templateHash": "5080257549333818093",
        "parameters": {
          "workspaceName": {
            "type": "String",
            "value": "Now"
          },
          "location": {
            "type": "String",
            "value": "centralus"
          },
          "resourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "sku": {
            "type": "String",
            "value": "Basic"
          },
          "identityType": {
            "type": "String",
            "value": "systemAssigned"
          },
          "primaryUserAssignedIdentityResourceGroup": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "primaryUserAssignedIdentityName": {
            "type": "String",
            "value": ""
          },
          "storageAccountOption": {
            "type": "String",
            "value": "new"
          },
          "storageAccountName": {
            "type": "String",
            "value": "now6998242530"
          },
          "storageAccountType": {
            "type": "String",
            "value": "Standard_LRS"
          },
          "storageAccountBehindVNet": {
            "type": "String",
            "value": "false"
          },
          "storageAccountResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "storageAccountLocation": {
            "type": "String",
            "value": "centralus"
          },
          "storageAccountHnsEnabled": {
            "type": "Bool",
            "value": false
          },
          "keyVaultOption": {
            "type": "String",
            "value": "new"
          },
          "keyVaultName": {
            "type": "String",
            "value": "now8675439885"
          },
          "keyVaultBehindVNet": {
            "type": "String",
            "value": "false"
          },
          "keyVaultResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "keyVaultLocation": {
            "type": "String",
            "value": "centralus"
          },
          "applicationInsightsOption": {
            "type": "String",
            "value": "new"
          },
          "applicationInsightsName": {
            "type": "String",
            "value": "now6579198507"
          },
          "applicationInsightsResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "applicationInsightsLocation": {
            "type": "String",
            "value": "centralus"
          },
          "containerRegistryOption": {
            "type": "String",
            "value": "existing"
          },
          "containerRegistryName": {
            "type": "String",
            "value": "Kingjamesbuvelocallaghanthethird"
          },
          "containerRegistrySku": {
            "type": "String",
            "value": "Premium"
          },
          "containerRegistryResourceGroupName": {
            "type": "String",
            "value": "resource-banks-james-burvel-jocall3"
          },
          "containerRegistryBehindVNet": {
            "type": "String",
            "value": "false"
          },
          "containerRegistryLocation": {
            "type": "String",
            "value": "eastus2"
          },
          "vnetOption": {
            "type": "String",
            "value": "none"
          },
          "vnetName": {
            "type": "String",
            "value": "vnej4tnbi4tb7wk"
          },
          "vnetResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "addressPrefixes": {
            "type": "Array",
            "value": [
              "10.0.0.0/16"
            ]
          },
          "subnetOption": {
            "type": "String",
            "value": "none"
          },
          "subnetName": {
            "type": "String",
            "value": "snej4tnbi4tb7wk"
          },
          "subnetPrefix": {
            "type": "String",
            "value": "10.0.0.0/24"
          },
          "adbWorkspace": {
            "type": "String",
            "value": ""
          },
          "confidential_data": {
            "type": "String",
            "value": "false"
          },
          "encryption_status": {
            "type": "String",
            "value": "Disabled"
          },
          "cmk_keyvault": {
            "type": "String",
            "value": ""
          },
          "resource_cmk_uri": {
            "type": "String",
            "value": ""
          },
          "cmk_storageAccountId": {
            "type": "String",
            "value": ""
          },
          "cmk_searchAccountId": {
            "type": "String",
            "value": ""
          },
          "cmk_cosmosDbId": {
            "type": "String",
            "value": ""
          },
          "privateEndpointType": {
            "type": "String",
            "value": "none"
          },
          "tagValues": {
            "type": "Object",
            "value": {}
          },
          "privateEndpointName": {
            "type": "String",
            "value": "pe"
          },
          "privateEndpointResourceGroupName": {
            "type": "String",
            "value": "cloud-shell-storage-eastus"
          },
          "privateEndpointSubscription": {
            "type": "String",
            "value": "aba6fac4-db66-4d0c-8bce-e11e744b44df"
          },
          "systemDatastoresAuthMode": {
            "type": "String",
            "value": "accessKey"
          }
        },
        "mode": "Incremental",
        "debugSetting": {
          "detailLevel": "None"
        },
        "provisioningState": "Running",
        "timestamp": "2022-04-11T19:57:13.3126092Z",
        "duration": "PT3.9818452S",
        "correlationId": "b3e0e28c-4726-487e-a294-d2909b599f27",
        "providers": [
          {
            "namespace": "Microsoft.Storage",
            "resourceTypes": [
              {
                "resourceType": "storageAccounts",
                "locations": [
                  "centralus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.KeyVault",
            "resourceTypes": [
              {
                "resourceType": "vaults",
                "locations": [
                  "centralus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.Insights",
            "resourceTypes": [
              {
                "resourceType": "components",
                "locations": [
                  "centralus"
                ]
              }
            ]
          },
          {
            "namespace": "Microsoft.MachineLearningServices",
            "resourceTypes": [
              {
                "resourceType": "workspaces",
                "locations": [
                  "centralus"
                ]
              }
            ]
          }
        ],
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Storage/storageAccounts/now6998242530",
                "resourceType": "Microsoft.Storage/storageAccounts",
                "resourceName": "now6998242530"
              },
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.KeyVault/vaults/now8675439885",
                "resourceType": "Microsoft.KeyVault/vaults",
                "resourceName": "now8675439885"
              },
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Insights/components/now6579198507",
                "resourceType": "Microsoft.Insights/components",
                "resourceName": "now6579198507"
              },
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.ContainerRegistry/registries/Kingjamesbuvelocallaghanthethird",
                "resourceType": "Microsoft.ContainerRegistry/registries",
                "resourceName": "Kingjamesbuvelocallaghanthethird"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.MachineLearningServices/workspaces/Now",
            "resourceType": "Microsoft.MachineLearningServices/workspaces",
            "resourceName": "Now"
          },
          {
            "dependsOn": [
              {
                "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.MachineLearningServices/workspaces/Now",
                "resourceType": "Microsoft.MachineLearningServices/workspaces",
                "resourceName": "Now"
              }
            ],
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Resources/deployments/DeployPrivateEndpoint-4yxlorfvgucfo",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "DeployPrivateEndpoint-4yxlorfvgucfo"
          }
        ],
        "validationLevel": "Template"
      }
    },
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment_operations (2) 2 (1).json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment_operations (2) 2.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.235Z"
  },
  {
    "filename": "deployment_operations 10.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 11 (1).json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 11.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 12.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 13.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 14.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/Microsoft.Web-WebAppDatabase-Portal-2b91f6c0-acf0/operations/77B7FAAFD864D013",
        "operationId": "77B7FAAFD864D013",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-17T00:19:03.6841947Z",
          "duration": "PT16.6878592S",
          "trackingId": "4bdfa821-6439-4f8a-8cc4-bb5be0ebdeee",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/vnetResourcesDeployment",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "vnetResourcesDeployment"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 15.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 16.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427/operations/FF0E42230B78462C",
        "operationId": "FF0E42230B78462C",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-09T01:12:42.5743389Z",
          "duration": "PT0.7590176S",
          "trackingId": "99f25c5a-95a4-4fdd-8043-97f896abd404",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "deploy-storage-and-identity-jimmythakidd"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 17.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/Microsoft.AppConfiguration-20220416200304-5132/operations/FB5CD6ADA160DEC6",
        "operationId": "FB5CD6ADA160DEC6",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-17T00:03:15.9324257Z",
          "duration": "PT1.2972455S",
          "trackingId": "5523a4f4-24ef-4ac9-9a0b-7f62a588ea38",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Resources/deployments/Jopbet_group-vnet_a2104778-dfdb-4c91-8ce9-eb654e491022",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "Jopbet_group-vnet_a2104778-dfdb-4c91-8ce9-eb654e491022"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 18.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 19.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.Resources/deployments/Microsoft.CloudNativeTesting1650034785129/operations/CEFDB4BAFDAADC05",
        "operationId": "CEFDB4BAFDAADC05",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-15T14:59:51.1666572Z",
          "duration": "PT2.7571652S",
          "trackingId": "d2582371-740a-431a-b6a2-a1c955bb3e33",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/cloud-shell-storage-eastus/providers/Microsoft.LoadTestService/loadtests/Included",
            "resourceType": "Microsoft.LoadTestService/loadtests",
            "resourceName": "Included"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 2.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 20.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Billioniotassets/providers/Microsoft.Resources/deployments/Microsoft.ContainerInstances-20220414042336/operations/DD9CCE8DED27B46A",
        "operationId": "DD9CCE8DED27B46A",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-14T10:00:13.1822586Z",
          "duration": "PT7.6740265S",
          "trackingId": "f496052a-746e-46f6-a1a6-49d05b197ad8",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Billioniotassets/providers/Microsoft.ContainerInstance/containerGroups/cntainer",
            "resourceType": "Microsoft.ContainerInstance/containerGroups",
            "resourceName": "cntainer"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 21.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 22.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 23.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 24.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427/operations/1559A7C194C8C50E",
        "operationId": "1559A7C194C8C50E",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-09T01:13:14.309641Z",
          "duration": "PT32.4943197S",
          "trackingId": "cad6f41a-1ae8-459a-a3c2-b14ea4ad64fa",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Media/mediaservices/jimmythakidd",
            "resourceType": "Microsoft.Media/mediaservices",
            "resourceName": "jimmythakidd"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427/operations/FF0E42230B78462C",
        "operationId": "FF0E42230B78462C",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-09T01:13:13.0401661Z",
          "duration": "PT31.2248448S",
          "trackingId": "61c2b485-1067-41cc-a034-a66df5cff392",
          "statusCode": "OK",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "deploy-storage-and-identity-jimmythakidd"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427/operations/08585521401241215855",
        "operationId": "08585521401241215855",
        "properties": {
          "provisioningOperation": "EvaluateDeploymentOutput",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-09T01:13:14.3755742Z",
          "duration": "PT32.5602529S",
          "trackingId": "dba06b07-9926-47a2-a73f-76753c002334",
          "statusCode": "OK"
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.236Z"
  },
  {
    "filename": "deployment_operations 25.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/EftProcessing/providers/Microsoft.Resources/deployments/Microsoft.AzureMonitorPrivateLinkScope/operations/6A658728F8EA5D21",
        "operationId": "6A658728F8EA5D21",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-18T01:57:00.1907619Z",
          "duration": "PT4.645784S",
          "trackingId": "9ca1e353-1378-40a6-b8ca-1e11ae817033",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/EftProcessing/providers/microsoft.insights/privatelinkscopes/AzureMonitoring",
            "resourceType": "microsoft.insights/privatelinkscopes",
            "resourceName": "AzureMonitoring"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/EftProcessing/providers/Microsoft.Resources/deployments/Microsoft.AzureMonitorPrivateLinkScope/operations/08585513598715551867",
        "operationId": "08585513598715551867",
        "properties": {
          "provisioningOperation": "EvaluateDeploymentOutput",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-18T01:57:00.8597159Z",
          "duration": "PT5.314738S",
          "trackingId": "90a74de4-7a42-4453-98f4-8e5e739e1b47",
          "statusCode": "OK"
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 26.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/Microsoft.Web-AppServiceCertificates-Portal-2fc7cea6-8138/operations/69F2277A62678E3F",
        "operationId": "69F2277A62678E3F",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-17T03:35:41.6643179Z",
          "duration": "PT23.0863316S",
          "trackingId": "9fdf6a58-4dc7-4d9a-93be-7fef86595952",
          "statusCode": "OK",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.CertificateRegistration/certificateOrders/cacert",
            "resourceType": "Microsoft.CertificateRegistration/certificateOrders",
            "resourceName": "cacert"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/spring-boot-complete-1649734694672-rg/providers/Microsoft.Resources/deployments/Microsoft.Web-AppServiceCertificates-Portal-2fc7cea6-8138/operations/08585514403681954349",
        "operationId": "08585514403681954349",
        "properties": {
          "provisioningOperation": "EvaluateDeploymentOutput",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-17T03:35:41.7240315Z",
          "duration": "PT23.1460452S",
          "trackingId": "45c729ba-6d85-4c63-98f9-006201c9ec18",
          "statusCode": "OK"
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 27.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 28.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 29.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 3 (1).json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 3.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 30.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 31.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 32.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427/operations/FF0E42230B78462C",
        "operationId": "FF0E42230B78462C",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-09T01:12:42.5743389Z",
          "duration": "PT0.7590176S",
          "trackingId": "99f25c5a-95a4-4fdd-8043-97f896abd404",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "deploy-storage-and-identity-jimmythakidd"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 33.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427/operations/FF0E42230B78462C",
        "operationId": "FF0E42230B78462C",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-09T01:12:42.5743389Z",
          "duration": "PT0.7590176S",
          "trackingId": "99f25c5a-95a4-4fdd-8043-97f896abd404",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "deploy-storage-and-identity-jimmythakidd"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 34.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/NoMarketplace-Portal-jimmythakidd-1649466724427/operations/FF0E42230B78462C",
        "operationId": "FF0E42230B78462C",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-09T01:12:42.5743389Z",
          "duration": "PT0.7590176S",
          "trackingId": "99f25c5a-95a4-4fdd-8043-97f896abd404",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jame/providers/Microsoft.Resources/deployments/deploy-storage-and-identity-jimmythakidd",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "deploy-storage-and-identity-jimmythakidd"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 4.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/8a19f858-0142-460a-8c9c-ac12589c176b/operations/A66DE88F29338B97",
        "operationId": "A66DE88F29338B97",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-16T06:45:57.9992558Z",
          "duration": "PT2.9859338S",
          "trackingId": "853b9f03-a8a2-4ab3-95bc-0fdcb8c16c1d",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/10aaa325-8167-4d39-86fc-99d91901c0fe",
            "resourceType": "Microsoft.ManagedServices/registrationDefinitions",
            "resourceName": "10aaa325-8167-4d39-86fc-99d91901c0fe"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/8a19f858-0142-460a-8c9c-ac12589c176b/operations/08585515153358372313",
        "operationId": "08585515153358372313",
        "properties": {
          "provisioningOperation": "EvaluateDeploymentOutput",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-16T06:45:58.1138379Z",
          "duration": "PT3.1005159S",
          "trackingId": "77b0ba4c-b7d7-45fd-b039-e4458a692c41",
          "statusCode": "OK"
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.237Z"
  },
  {
    "filename": "deployment_operations 5.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/47c223d3-031f-4566-b4d7-26befa20c529/operations/E4D9646ACF40EAC7",
        "operationId": "E4D9646ACF40EAC7",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-16T01:44:46.1856033Z",
          "duration": "PT1.9417301S",
          "trackingId": "cbbe00b3-590b-44c6-8189-dac3ea999c7b",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/caa22925-a776-49db-af60-1a2189d0132e",
            "resourceType": "Microsoft.ManagedServices/registrationDefinitions",
            "resourceName": "caa22925-a776-49db-af60-1a2189d0132e"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/47c223d3-031f-4566-b4d7-26befa20c529/operations/08585515334037329394",
        "operationId": "08585515334037329394",
        "properties": {
          "provisioningOperation": "EvaluateDeploymentOutput",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-16T01:44:46.4876905Z",
          "duration": "PT2.2438173S",
          "trackingId": "f30eb17e-6a3f-47e9-b53c-2542bb6050e2",
          "statusCode": "OK"
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.238Z"
  },
  {
    "filename": "deployment_operations 6.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/770c1cea-2a4e-43b1-beb5-a92f2bc0632f/operations/7C0201809F51D70C",
        "operationId": "7C0201809F51D70C",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-14T20:55:07.7812039Z",
          "duration": "PT3.2605925S",
          "trackingId": "44cccc83-ecee-4e0c-8d04-1418aba2262e",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.ManagedServices/registrationDefinitions/90f1322f-63fd-4be8-b0e5-0ad6858cc4b8",
            "resourceType": "Microsoft.ManagedServices/registrationDefinitions",
            "resourceName": "90f1322f-63fd-4be8-b0e5-0ad6858cc4b8"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/providers/Microsoft.Resources/deployments/770c1cea-2a4e-43b1-beb5-a92f2bc0632f/operations/08585516371831842391",
        "operationId": "08585516371831842391",
        "properties": {
          "provisioningOperation": "EvaluateDeploymentOutput",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-14T20:55:08.0949452Z",
          "duration": "PT3.5743338S",
          "trackingId": "6d86d6a9-a719-4ef5-a6e0-5ee6e99f317f",
          "statusCode": "OK"
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.238Z"
  },
  {
    "filename": "deployment_operations 7.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.238Z"
  },
  {
    "filename": "deployment_operations 8.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/VstsRG-13-6add/providers/Microsoft.Resources/deployments/Deploy_DevOps_Project_13/operations/7E3754AF77393F3E",
        "operationId": "7E3754AF77393F3E",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-10T03:24:03.7540383Z",
          "duration": "PT9.8541269S",
          "trackingId": "a5674915-f5be-4282-b392-64abb5f15a5e",
          "statusCode": "OK",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/VstsRG-13-6add/providers/Microsoft.DevOps/pipelines/13",
            "resourceType": "Microsoft.DevOps/pipelines",
            "resourceName": "13"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/VstsRG-13-6add/providers/Microsoft.Resources/deployments/Deploy_DevOps_Project_13/operations/08585520458527552855",
        "operationId": "08585520458527552855",
        "properties": {
          "provisioningOperation": "EvaluateDeploymentOutput",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-10T03:24:04.0474161Z",
          "duration": "PT10.1475047S",
          "trackingId": "e5619391-f059-484c-a74b-887bf43b63e5",
          "statusCode": "OK"
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.238Z"
  },
  {
    "filename": "deployment_operations 9.json",
    "data": [
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/DiskAccess.uyup-20220414022353/operations/F236DEB490C17310",
        "operationId": "F236DEB490C17310",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Running",
          "timestamp": "2022-04-14T06:28:09.8685635Z",
          "duration": "PT4M12.8232103S",
          "trackingId": "1ca868f8-80f4-4ee5-9642-c752814765ce",
          "statusCode": "Created",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/Jopbet_group/providers/Microsoft.Resources/deployments/PrivateDns-334064ed31e047a398ac60bff9912032",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "PrivateDns-334064ed31e047a398ac60bff9912032"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/DiskAccess.uyup-20220414022353/operations/593FB0BD3CD1C78A",
        "operationId": "593FB0BD3CD1C78A",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-14T06:26:45.910939Z",
          "duration": "PT2M48.8655858S",
          "trackingId": "c3dc0e7f-c066-4a7e-9a76-67c9f9e329d7",
          "statusCode": "OK",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/bitcoin_334064ed-31e0-47a3-98ac-60bff9912031",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "bitcoin_334064ed-31e0-47a3-98ac-60bff9912031"
          }
        }
      },
      {
        "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Resources/deployments/DiskAccess.uyup-20220414022353/operations/833BF3BDBF8F1287",
        "operationId": "833BF3BDBF8F1287",
        "properties": {
          "provisioningOperation": "Create",
          "provisioningState": "Succeeded",
          "timestamp": "2022-04-14T06:24:17.7845144Z",
          "duration": "PT20.7391612S",
          "trackingId": "6cc94f38-b7f4-4866-9ef3-219a07f4d80f",
          "statusCode": "OK",
          "targetResource": {
            "id": "/subscriptions/aba6fac4-db66-4d0c-8bce-e11e744b44df/resourceGroups/bit4566455_group/providers/Microsoft.Compute/diskAccesses/uyup",
            "resourceType": "Microsoft.Compute/diskAccesses",
            "resourceName": "uyup"
          }
        }
      }
    ],
    "processedAt": "2026-08-30T22:14:55.238Z"
  },
  {
    "filename": "deployment_operations.json",
    "data": [],
    "processedAt": "2026-08-30T22:14:55.238Z"
  }
];

export function AzureDeploymentVault() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(deploymentVaultData[0] || null);
  const [copied, setCopied] = useState(false);

  const filtered = deploymentVaultData.filter(item => 
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(item.data).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0D1117] text-slate-200 p-6 rounded-2xl border border-[#30363D] shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Azure Deployment & Credentials Vault</h2>
          </div>
          <p className="text-xs text-[#8B949E] mt-1">
            Consolidated from {deploymentVaultData.length} deployment JSON files & operation records. Embedded with secure credentials and parameters.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8B949E]" />
          <input
            type="text"
            placeholder="Search deployments, tokens, principals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-[#161B22] border border-[#30363D] rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
          <p className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider px-2">
            Deployment Records ({filtered.length})
          </p>
          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedItem(item)}
              className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-mono ${
                selectedItem?.filename === item.filename
                  ? 'bg-blue-600/20 border-blue-500/50 text-white'
                  : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:text-white hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold truncate">{item.filename}</span>
                <Key className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {Array.isArray(item.data) ? `Batch (${item.data.length} operations)` : (item.data as any)?.name || (item.data as any)?.id || 'Record ID loaded'}
              </p>
            </button>
          ))}
        </div>

        {/* Right Details Inspector */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4 shadow-inner">
          {selectedItem ? (
            <>
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{selectedItem.filename}</h3>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Processed & Securely Embedded in Component State</p>
                </div>
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedItem.data, null, 2))}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1">
                  <span className="text-[10px] text-[#8B949E] uppercase font-mono">Record Source & Timestamp</span>
                  <p className="text-xs text-slate-300 font-mono">{selectedItem.filename} • {selectedItem.processedAt}</p>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-emerald-400 font-mono text-xs overflow-x-auto max-h-[450px] leading-relaxed">
                    {JSON.stringify(selectedItem.data, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-[#8B949E] text-xs">
              Select a deployment file record to inspect credentials and payload.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
