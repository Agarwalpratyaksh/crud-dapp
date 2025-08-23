import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Crud } from '../target/types/crud'
import { title } from 'process'

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Crud as Program<Crud>

  const crudKeypair = Keypair.generate()

  const title = 'LOL'
  const message = 'This is my LOL testing profrma'

  const updatedTitle = 'Goa'
  const updatedMessage = 'lol testing message'

  it('Initialize Journal Entry', async () => {
    const [journalPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [payer.publicKey.toBuffer(), Buffer.from(title)],
      program.programId,
    )

    await program.methods
      .createJournalEntry(title, message)
      .accounts({
        owner: payer.publicKey,
      })
      .rpc()
    const journalData = await program.account.journalEntryState.fetch(journalPda)
    console.log(journalData)

    expect(journalData.title).toBe(title)
    expect(journalData.message).toBe(message)
  })

  it('Update Journal Entry', async () => {
    const [journalPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [payer.publicKey.toBuffer(), Buffer.from(title)],
      program.programId,
    )

    await program.methods
      .updateJournalEntry(title, updatedMessage)
      .accounts({
        owner: payer.publicKey,
      })
      .rpc()
    const journalData = await program.account.journalEntryState.fetch(journalPda)
    console.log(journalData)

    expect(journalData.title).toBe(title)
    expect(journalData.message).toBe(updatedMessage)
  })

  it('Delete Journal Entry', async () => {
    const [journalPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [payer.publicKey.toBuffer(), Buffer.from(title)],
      program.programId,
    )
   const journalData = await program.account.journalEntryState.fetch(journalPda)
   console.log("Data befor deletign")
      console.log(journalData)
  

    await program.methods
      .deleteJournal(title)
      .accounts({
        owner: payer.publicKey,
      })
      .rpc()

    try {
      const journalData = await program.account.journalEntryState.fetch(journalPda)
      console.log(journalData)
      expect(true).toBe(false)
    } catch (error) {
      console.log(error)
      // expect(error.message).toBe("AccountNotFound")

    }


  })
})
