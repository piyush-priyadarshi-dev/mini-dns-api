import { addDnsRecordApi, DNSRecordTypeEnum } from "@/lib/common/schema/dns-records";
import { ApiRequest, ApiResponse, createEndpoint, endpointsWrapper, onMethodNotSupported } from "@/lib/server/nextEndpointHelper";
import { addDnsRecordUseCase, getDnsRecordsUseCase } from "@/services/dnsRecords.service";
import { validateDnsRecordConflict } from "@/utils/dnsRules";
import * as yup from "yup";

const addDnsRecordBodySchema = yup
    .object()
    .shape({
        type: yup
            .string()
            .oneOf(Object.values(DNSRecordTypeEnum), 'Invalid DNS record type')
            .required(),

        hostname: yup
            .string()
            .matches(
                /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Invalid hostname format'
            )
            .required(),

        value: yup
            .string()
            .test('valid-ip-or-hostname', 'Invalid value format', function (value) {
                const { type } = this.parent;
                if (!value) return false
                if (type === DNSRecordTypeEnum.A) {
                    return /^(\d{1,3}\.){3}\d{1,3}$/.test(value); // basic IPv4
                }

                // For CNAME, MX, TXT — must be valid hostname or text
                return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            })
            .required(),

        ttl: yup.number().positive().optional(),
    })
    .strict()
    .noUnknown();

const createDnsRecord = async (
    req: ApiRequest<addDnsRecordApi["request"]>,
    res: ApiResponse<addDnsRecordApi["response"]>
) => {

    try {
        await addDnsRecordBodySchema.validate(req.body);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }

    const {
        type,
        hostname,
        value,
        ttl = 3600, // default TTL
    } = req.body;

    const existingRecords = await getDnsRecordsUseCase(hostname);

    const conflictMessage = validateDnsRecordConflict(type, value, existingRecords);
    
    if (conflictMessage) {
        return res.status(409).json({ message: conflictMessage });
    }
    const newRecord = await addDnsRecordUseCase(hostname, type, value, ttl);

    if (!newRecord) {
        return res.status(500).json({ message: 'Failed to create DNS record' });
    }
    return res.status(201).json({ success: true, data: newRecord });

};

export default endpointsWrapper(
    createEndpoint().post(createDnsRecord).all(onMethodNotSupported)
);
