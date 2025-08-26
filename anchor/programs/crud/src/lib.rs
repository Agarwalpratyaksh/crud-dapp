#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("ByuZ5GFkWpp9oD9mAen7vJ8WZKcQra7WUcQ1C5bNVVFj");

#[program]
pub mod crud {
    use super::*;

    //create_journal_entry
    //update_journal_entry
    //delete_journal_entry

    pub fn create_journal_entry(ctx: Context<CreateEntry>, title: String, message: String) -> Result<()> {

        msg!("Owner {}",ctx.accounts.owner.key());
        msg!("title {}",title);
        msg!("message {}",message);

        ctx.accounts.journal_entry.owner = ctx.accounts.owner.key();
        ctx.accounts.journal_entry.title = title.clone();
        ctx.accounts.journal_entry.message = message.clone();

       

        Ok(())

    }

        pub fn update_journal_entry(ctx: Context<UpdateEntry>, _title: String, message: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;
        msg!("Owner {}",ctx.accounts.owner.key());
        msg!("title {}",journal_entry.title);
        msg!("message {}",ctx.accounts.journal_entry.message);

        Ok(())

    }

    pub fn delete_journal(_ctx:Context<DeleteEntry>,_title:String)->Result<()>{
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(title:String,message:String)]
pub struct CreateEntry<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(init,seeds=[owner.key().as_ref(),title.as_bytes()],bump,space = 8 + JournalEntryState::INIT_SPACE, payer=owner)]
    pub journal_entry : Account<'info,JournalEntryState>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String,message:String)]
pub struct UpdateEntry<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut,seeds=[owner.key().as_ref(),title.as_bytes()],bump, realloc=8+JournalEntryState::INIT_SPACE, realloc::payer=owner,realloc::zero=true)]
    pub journal_entry : Account<'info,JournalEntryState>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteEntry<'info>{

    #[account(mut)]
    pub owner :Signer<'info>,

    #[account(mut,seeds=[owner.key().as_ref(),title.as_bytes()],bump, close = owner)]
    pub journal_entry :Account<'info, JournalEntryState>,

    pub system_program : Program<'info, System>

}


#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
    pub owner: Pubkey,
    #[max_len(30)]
    pub title: String,
    #[max_len(50)]
    pub message: String,
}
