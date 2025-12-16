<template>
    <div class="supabase-container">
        <div>
            <input v-model="label" label="Label"></input>
            <input v-model="value" label="Value"></input>
            <button @click="createItem">Add Item</button>
        </div>
        <!-- <pre>{{ items }}</pre> -->
        <div v-for="item in items" :key="item.id">

            <template v-if="editItems[item.id] != true">
                <span>{{ item.label }}</span>
                <span>{{ item.value }}</span>
                <button @click="editItems[item.id] = true">Edit</button>
            </template>"

            <template v-if="editItems[item.id] == true">
                <input v-model="item.label" />
                <input v-model="item.value" />
                <button @click="updateItem(item)">Update</button>"
                <button @click="deleteItem(item.id  )">delete</button>"
            </template>
        </div>
    </div>
</template>


<script>
import { supabase } from '../library/supabase.js';

export default {
    data() {
        return {
            items: [],
            value: "",
            label: "",
            editingId: null,
            editItems: {}
        }
    },

    mounted() {
        this.loadItems();
    },

    methods: {
        async loadItems() {
            const { data, error } = await supabase
                .from("todo")
                .select("*")
                .order("id", { ascending: true });

            if (!error) this.items = data;
        },

        async createItem() {
            const { data, error } = await supabase
                .from("todo")
                .insert([
                    {
                        label: this.label,
                        value: this.value
                    },
                ])
                .select();

            if (!error) {
                // reload items
                // success notification
                this.loadItems();
            }
        },

        async updateItem(item) {
            const { error } = await supabase
                .from("todo")
                .update({
                    label: item.label,
                    value: item.value,
                })
                .eq("id", item.id)
                .select();

            if (!error) {
                // reload items
                // success notification
                this.editItems[item.id] = false;
            }
        },

        async deleteItem(id) {
            const { error } = await supabase.from("todo")
                .delete()
                .eq("id", id);

            if (!error) {
                // reload items
                // success notification
                this.loadItems();
            }
        },



    }
}

</script>

<style scoped>
.supabase-container {
    background-color: #000000;
    min-height: 100vh;
    padding: 1rem;
}

span {
    margin-right: 10px;
}
</style>
