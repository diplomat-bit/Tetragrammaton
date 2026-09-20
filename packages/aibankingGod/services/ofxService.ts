import { ParsedOFXStatement, OFXAccount, OFXTransaction } from '../types/ofx';

export class OFXService {
  /**
   * Parses raw OFX SGML/XML string content into structured Accounts and Transactions.
   */
  public static parse(ofxText: string): ParsedOFXStatement {
    const accounts: OFXAccount[] = [];
    const transactions: OFXTransaction[] = [];

    const orgMatch = ofxText.match(/<ORG>(.*?)(?=\r|\n|<)/i);
    const fidMatch = ofxText.match(/<FID>(.*?)(?=\r|\n|<)/i);
    const org = orgMatch ? orgMatch[1].trim() : 'Citigroup';
    const fid = fidMatch ? fidMatch[1].trim() : '11569';

    const stmtBlocks = ofxText.split(/<STMTTRNRS>/i).slice(1);
    if (stmtBlocks.length === 0) {
      const acctBlocks = ofxText.split(/<BANKACCTFROM>/i).slice(1);
      acctBlocks.forEach((block, idx) => {
        this.parseBlock(block, org, fid, idx, accounts, transactions);
      });
    } else {
      stmtBlocks.forEach((block, idx) => {
        this.parseBlock(block, org, fid, idx, accounts, transactions);
      });
    }

    const totalBalance = accounts.reduce((sum, a) => sum + (a.ledgerBalance || 0), 0);

    return {
      organization: org,
      fid: fid,
      accountCount: accounts.length,
      transactionCount: transactions.length,
      totalBalance,
      accounts,
      transactions
    };
  }

  private static parseBlock(
    block: string,
    org: string,
    fid: string,
    idx: number,
    accounts: OFXAccount[],
    transactions: OFXTransaction[]
  ) {
    const bankIdMatch = block.match(/<BANKID>(.*?)(?=\r|\n|<)/i);
    const acctIdMatch = block.match(/<ACCTID>(.*?)(?=\r|\n|<)/i);
    const acctTypeMatch = block.match(/<ACCTTYPE>(.*?)(?=\r|\n|<)/i);
    const balAmtMatch = block.match(/<BALAMT>(.*?)(?=\r|\n|<)/i);

    const bankId = bankIdMatch ? bankIdMatch[1].trim() : '003456789';
    const acctId = acctIdMatch ? acctIdMatch[1].trim() : `CKG-${idx + 1}`;
    const rawType = acctTypeMatch ? acctTypeMatch[1].trim().toUpperCase() : 'CHECKING';
    const acctType = (['CHECKING', 'SAVINGS', 'MONEYMRKT', 'CREDITLINE'].includes(rawType) ? rawType : 'CHECKING') as any;
    const ledgerBalance = balAmtMatch ? parseFloat(balAmtMatch[1].trim()) : 0;

    accounts.push({
      id: acctId,
      bankId,
      acctId,
      acctType,
      org,
      fid,
      ledgerBalance,
      currency: 'USD'
    });

    const trnRegex = /<STMTTRN>([\s\S]*?)(?=(?:<\/STMTTRN>|<STMTTRN>|<\/BANKTRANLIST>|$))/gi;
    let trnMatch;
    while ((trnMatch = trnRegex.exec(block)) !== null) {
      const trnContent = trnMatch[1];
      const typeM = trnContent.match(/<TRNTYPE>(.*?)(?=\r|\n|<)/i);
      const dateM = trnContent.match(/<DTPOSTED>(.*?)(?=\r|\n|<)/i);
      const amtM = trnContent.match(/<TRNAMT>(.*?)(?=\r|\n|<)/i);
      const fitidM = trnContent.match(/<FITID>(.*?)(?=\r|\n|<)/i);
      const nameM = trnContent.match(/<NAME>(.*?)(?=\r|\n|<)/i);
      const memoM = trnContent.match(/<MEMO>(.*?)(?=\r|\n|<)/i);

      if (fitidM || amtM) {
        const nameStr = nameM ? nameM[1].trim() : 'BANK TRANSACTION';
        transactions.push({
          id: fitidM ? fitidM[1].trim() : `TRN-${Date.now()}-${Math.random()}`,
          accountId: acctId,
          type: (typeM ? typeM[1].trim().toUpperCase() : 'DEBIT') as any,
          postedDate: dateM ? dateM[1].trim() : new Date().toISOString(),
          amount: amtM ? parseFloat(amtM[1].trim()) : 0,
          fitid: fitidM ? fitidM[1].trim() : '',
          name: nameStr,
          memo: memoM ? memoM[1].trim() : '',
          category: this.categorize(nameStr)
        });
      }
    }
  }

  /**
   * Auto-categorizes bank transactions based on counterparty rules.
   */
  public static categorize(name: string): string {
    const upper = name.toUpperCase();
    if (upper.includes('DOVENMUEHLE') || upper.includes('MORTGAGE') || upper.includes('PHH') || upper.includes('OCWEN')) {
      return 'Mortgage Servicing & Remittance';
    }
    if (upper.includes('WIRE') || upper.includes('TRANSFER')) {
      return 'Institutional Wire Transfer';
    }
    if (upper.includes('SERVICE CHARGE') || upper.includes('FEE')) {
      return 'Bank Administrative Fee';
    }
    if (upper.includes('DIVIDEND') || upper.includes('INTEREST')) {
      return 'Yield / Dividend Credit';
    }
    return 'General Treasury Ledger Entry';
  }
}
