import { SupabaseClient, createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

type Query = {
    condition ?: string,
    query : string,
    likeCol ?: string
    likePat ?: string,
    from ?: number,
    to ?: number,
    orderBy ?: string
    ascending ?: boolean,
    or ?: string,
    or_reference_table ?: string
}

type TableType = "UserCred" | "Users" | "UsrMsg" | string & {};

class SupaBaseDB {
    db : SupabaseClient<any>;
    constructor(){
        this.db = createClient(process.env['SUPABASE_DATABASE'] ?? '',process.env['SUPABASE_key'] ?? '');
    }

    async insertData(data : object,tableName : TableType) : Promise<boolean>{
        const resp = await this.db.from(tableName).insert(data);
        if(resp.status == 201){
            return true;
        }
        return false
    }

    async fetchData(tableName : TableType ,searchQuery : Query) : Promise<Array<any>>{
        const dbQuery= this.db.from(tableName).select(searchQuery.query);
        if(searchQuery.condition){
            const conditionPair = searchQuery.condition.split("=");
            dbQuery.eq(conditionPair[0],conditionPair[1]);
        }
        if(searchQuery.from && searchQuery.to){
            dbQuery.range(searchQuery.from,searchQuery.to);
        }
        if(searchQuery.likeCol && searchQuery.likePat){
            dbQuery.like(searchQuery.likeCol,searchQuery.likePat);
        }
        if(searchQuery.orderBy){
            dbQuery.order(searchQuery.orderBy,{ascending : searchQuery.ascending ? true : false});
        }
        searchQuery.or ? dbQuery.or(searchQuery.or,{referencedTable : searchQuery.or_reference_table}) : '';
        const resp = await dbQuery;
        if(resp.status == 200 && resp.data?.length){
            return resp.data;
        }
        return [];
    }

    async updataData(tableName : TableType ,data : object,condition : string) : Promise<boolean>{
        const conditionPair = condition.split("=");
        const resp = await this.db.from(tableName).update(data).eq(conditionPair[0],conditionPair[1]);
        if(resp.status == 204){
            return true;
        }
        return false;
    }

    async deleteData(tableName : TableType ,condition : string) : Promise<boolean>{
        const conditionPair = condition.split("=");
        const resp = await this.db.from(tableName).delete().eq(conditionPair[0],conditionPair[1]);
        if(resp.status == 204){
            return true;
        }
        return false
    }
}

export default SupaBaseDB;