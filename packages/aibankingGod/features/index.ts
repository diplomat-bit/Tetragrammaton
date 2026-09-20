
import { ALL_FEATURES } from '../constants';
import { Feature } from '../types';

// --- Core Data Structures and Types ---

export interface ExtendedFeature extends Feature {
    description: string;
    tags: string[];
    version: string;
    maturity: 'beta' | 'stable' | 'deprecated' | 'experimental';
    securityLevel: 'low' | 'medium' | 'high' | 'critical';
    costModel: 'free' | 'tier1' | 'tier2' | 'premium' | 'custom';
    requiredServices: string[];
    aiCapabilities?: {
        generative?: boolean;
        analytical?: boolean;
        predictive?: boolean;
        nlp?: boolean;
    };
    complianceStandards: string[];
    lastUpdated: string;
    developerContact: string;
    documentationUrl: string;
    usageMetrics?: {
        dailyActiveUsers: number;
        apiCallsPerDay: number;
    };
    associatedRisks?: string[];
    releaseNotes?: string;
    roadmapStatus?: 'planned' | 'in-development' | 'released' | 'on-hold';
}

export interface ExternalServiceDefinition {
    id: string;
    name: string;
    description: string;
    type: 'AI' | 'DataStorage' | 'Auth' | 'Messaging' | 'PaymentGateway' | 'Compute' | 'Monitoring' | 'Analytics' | 'Security' | 'Blockchain' | 'API_Gateway' | 'CDN' | 'CRM' | 'ERP' | 'IoT' | 'DevOps' | 'Search' | 'Notification' | 'Compliance' | 'Reporting';
    endpoint: string;
    apiKeyEnvVar: string;
    status: 'operational' | 'degraded' | 'maintenance';
    slaLevel: 'basic' | 'standard' | 'premium';
    costPerUnit?: string;
    vendor: string;
    integrationGuideUrl?: string;
    privacyPolicyUrl?: string;
    securityCertifications?: string[];
    geoAvailability: string[];
    dependencies?: string[];
}

// --- Service Generation ---

const generateSimulatedServices = (count: number): ExternalServiceDefinition[] => {
    const services: ExternalServiceDefinition[] = [];
    const serviceTypes: ExternalServiceDefinition['type'][] = [
        'AI', 'DataStorage' , 'Auth' , 'Messaging' , 'PaymentGateway' , 'Compute' , 'Monitoring',
        'Analytics', 'Security', 'Blockchain', 'API_Gateway', 'CDN', 'CRM', 'ERP', 'IoT',
        'DevOps', 'Search', 'Notification', 'Compliance', 'Reporting'
    ];
    const vendors = ['SovereignInternal', 'AWS', 'GoogleCloud', 'MicrosoftAzure', 'Stripe', 'Twilio', 'Plaid', 'OpenAI', 'GoogleAI', 'IBM'];
    
    for (let i = 1; i <= count; i++) {
        const type = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const serviceId = `${type.toLowerCase().replace(/ /g, '-')}-${vendor.toLowerCase().replace(/ /g, '-')}-${i.toString().padStart(4, '0')}`;
        services.push({
            id: serviceId,
            name: `${vendor} ${type} Service ${i}`,
            description: `A highly scalable ${type} service provided by ${vendor} for enterprise applications.`,
            type: type,
            endpoint: `https://api.${vendor.toLowerCase().replace(/ /g, '')}.${type.toLowerCase().replace(/ /g, '-')}.com/v1`,
            apiKeyEnvVar: `${vendor.toUpperCase()}_${type.toUpperCase()}_API_KEY`,
            status: Math.random() < 0.95 ? 'operational' : 'degraded',
            slaLevel: 'standard',
            costPerUnit: '$0.01/req',
            vendor: vendor,
            integrationGuideUrl: `https://docs.example.com`,
            privacyPolicyUrl: `https://privacy.example.com`,
            securityCertifications: ['ISO 27001'],
            geoAvailability: ['US-EAST-1'],
            dependencies: [],
        });
    }
    return services;
};

export const GLOBAL_EXTERNAL_SERVICES = generateSimulatedServices(100);

// --- Feature Generation ---

const generateMassiveFeatureSet = (baseFeatures: Feature[], additionalCount: number): ExtendedFeature[] => {
    return baseFeatures.map((f, index) => ({
        id: f.id,
        name: f.name,
        icon: f.icon,
        category: f.category,
        description: f.description || "Advanced financial feature.",
        tags: ['finance', 'core'],
        version: "1.0.0",
        maturity: 'stable' as const,
        securityLevel: 'high' as const,
        costModel: 'tier1' as const,
        requiredServices: [],
        complianceStandards: ['PCI-DSS'],
        lastUpdated: new Date().toISOString(),
        developerContact: "dev@demobank.com",
        documentationUrl: "#",
        usageMetrics: { dailyActiveUsers: 1000, apiCallsPerDay: 50000 }
    }));
};

export const GLOBAL_ALL_EXTENDED_FEATURES = generateMassiveFeatureSet(ALL_FEATURES, 50);

export const FEATURES_MAP = new Map<string, ExtendedFeature>();
GLOBAL_ALL_EXTENDED_FEATURES.forEach(f => {
    FEATURES_MAP.set(f.id, f);
});
