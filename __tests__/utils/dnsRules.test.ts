
import { DNSRecordTypeEnum } from '@/lib/common/schema/dns-records';
import { validateDnsRecordConflict } from '@/utils/dnsRules';

const makeRecord = (type: DNSRecordTypeEnum, value: string) => ({ id: "dummy-uuid", type, value, hostname: "piyushpriyadarshi.dev", ttl: 3600, created_at: new Date() });

describe('validateDnsRecordConflict', () => {
  it('allows multiple A records for the same hostname', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.A,
      '192.168.1.2',
      [makeRecord(DNSRecordTypeEnum.A, '192.168.1.1')]
    );
    expect(result).toBe(null);
  });

  it('blocks duplicate A record (same IP)', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.A,
      '192.168.1.1',
      [makeRecord(DNSRecordTypeEnum.A, '192.168.1.1')]
    );
    expect(result).toMatch(/duplicate.*A/i);
  });

  it('allows a single CNAME when no other records exist', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.CNAME,
      'alias.example.com',
      []
    );
    expect(result).toBe(null);
  });

  it('blocks CNAME if any record exists', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.CNAME,
      'alias.example.com',
      [makeRecord(DNSRecordTypeEnum.A, '192.168.1.1')]
    );
    expect(result).toMatch(/CNAME cannot be added/i);
  });

  it('blocks A if CNAME exists', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.A,
      '192.168.1.1',
      [makeRecord(DNSRecordTypeEnum.CNAME, 'alias.example.com')]
    );
    expect(result).toMatch(/CNAME already exists/i);
  });

  it('blocks duplicate CNAME', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.CNAME,
      'alias.example.com',
      [makeRecord(DNSRecordTypeEnum.CNAME, 'alias.example.com')]
    );
    expect(result).toMatch(/duplicate.*CNAME/i);
  });

  it('allows A + MX + TXT to coexist', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.TXT,
      'v=spf1 include:_spf.google.com ~all',
      [
        makeRecord(DNSRecordTypeEnum.A, '1.1.1.1'),
        makeRecord(DNSRecordTypeEnum.MX, 'mail.example.com')
      ]
    );
    expect(result).toBe(null);
  });

  it('blocks TXT if CNAME exists', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.TXT,
      'some text',
      [makeRecord(DNSRecordTypeEnum.CNAME, 'alias.example.com')]
    );
    expect(result).toMatch(/CNAME already exists/i);
  });

  it('blocks CNAME if MX exists', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.CNAME,
      'alias.example.com',
      [makeRecord(DNSRecordTypeEnum.MX, 'mail.example.com')]
    );
    expect(result).toMatch(/CNAME cannot be added/i);
  });

  it('blocks CNAME if TXT exists', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.CNAME,
      'alias.example.com',
      [makeRecord(DNSRecordTypeEnum.TXT, 'some text')]
    );
    expect(result).toMatch(/CNAME cannot be added/i);
  });

  it('allows multiple MX records with different values', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.MX,
      'backup.mail.example.com',
      [makeRecord(DNSRecordTypeEnum.MX, 'mail.example.com')]
    );
    expect(result).toBe(null);
  });

  it('blocks duplicate MX record', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.MX,
      'mail.example.com',
      [makeRecord(DNSRecordTypeEnum.MX, 'mail.example.com')]
    );
    expect(result).toMatch(/duplicate.*MX/i);
  });

  it('allows multiple TXT records for the same hostname', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.TXT,
      'v=spf1 include:_spf.google.com ~all',
      [makeRecord(DNSRecordTypeEnum.TXT, 'google-site-verification=abc123')]
    );
    expect(result).toBe(null);
  });

  it('blocks duplicate TXT record', () => {
    const result = validateDnsRecordConflict(
      DNSRecordTypeEnum.TXT,
      'v=spf1 include:_spf.google.com ~all',
      [makeRecord(DNSRecordTypeEnum.TXT, 'v=spf1 include:_spf.google.com ~all')]
    );
    expect(result).toMatch(/duplicate.*TXT/i);
  });
});
