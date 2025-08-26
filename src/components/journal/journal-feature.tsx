'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { ExplorerLink } from '../cluster/cluster-ui'
import { usecrudProgram } from './journal-data-access'
import { CounterCreate, CounterList } from './journal-ui'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'

export default function CounterFeature() {
  const { publicKey } = useWallet()
  const { programId } = usecrudProgram()

  return publicKey ? (
    <div className="container mx-auto p-6">
      <AppHero
        title="Journalling App"
        subtitle={
          'Enter the Title, Message and then Create, this will create you journal on chain '
        }
      >
        <p className="text-lg text-gray-600 mb-6 hover:text-gray-400">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <CounterCreate />
      </AppHero>
      <CounterList />
    </div>
  ) : (
    <div className="hero bg-gradient-to-r from-blue-500 to-teal-500 p-12 flex items-center justify-center">
      <div className="text-center text-white">
        <WalletButton />
      </div>
    </div>
  )
}
