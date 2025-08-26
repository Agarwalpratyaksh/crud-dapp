'use client'

import { getCrudProgram, getCrudProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'

type CreateEntryArgs = {
  title: string,
  message: string,
  owner: PublicKey
}

export function usecrudProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCrudProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCrudProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['crud', 'all', { cluster }],
    queryFn: () => program.account.journalEntryState.all()
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })


  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey:["Journal","create",{cluster}],
    mutationFn: async({title,message,owner})=>{
      return program.methods.createJournalEntry(title,message).accounts({owner:owner}).rpc()
    },

    onSuccess : async (signature) =>{
      transactionToast(signature)
      await accounts.refetch()
    },

    onError: (error)=>{
      toast.error(`Failed to create journal entry  ${error.message}`)
    }

  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  }
}

export function usecrudProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = usecrudProgram()

  const accountQuery = useQuery({
    queryKey: ['crud', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  })
  

  const updateJournal = useMutation<string,Error,CreateEntryArgs>({
    mutationKey:["Journal","update",{cluster}],
    mutationFn: async({title,message,owner })=>{
      return program.methods.updateJournalEntry(title,message).accounts({owner}).rpc()
    },

    onSuccess : async (signature) =>{
      transactionToast(signature)
      await accounts.refetch()
    },

    onError: (err)=>{
      toast.error(`Failed to update Journal Entry ${err.message}`)
    }
  })

  const deleteJournal = useMutation({
    mutationKey:["Journal","delete",{cluster}],
    mutationFn: async (title:string)=>{
      return program.methods.deleteJournal(title).rpc()
    },

    onSuccess : async(signature)=>{
      transactionToast(signature)
      await accounts.refetch()
    },

    onError: (err)=>{
      toast(`Error white deleting ${err.message}`)
    }

  })


  return {
    accountQuery,
    updateJournal,
    deleteJournal,
  
  }
}
