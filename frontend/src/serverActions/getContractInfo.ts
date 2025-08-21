'use server';
import path from 'path';
import { promises as fs } from 'fs';


export async function GetContractInfo() {

  const contractPath = path.join(process.cwd(), 'src/abi/TodoList.json');

  const contractInfo = await fs.readFile(contractPath, 'utf-8');

  const contractJson = JSON.parse(contractInfo);

  const contractAddress = process.env.CONTRACT_ADDRESS!;

  return {
    abi: contractJson,
    address: contractAddress
  }

}