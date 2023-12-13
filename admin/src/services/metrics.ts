const convertBytesToMB = (value: number) => {
  return Number((value / (1024 * 1024)).toFixed(2));
};

export const StrapiMetrics = (input: { requestClient: any; getClient: any }) => ({
  getMetrics: async (url: string) => {
    try {
      const res = await input.getClient(url);
      const { data } = res;
      const lines = data.split('\n');

      let strapi_process_resident_memory_bytes = 0;
      let strapi_process_virtual_memory_bytes = 0;
      let strapi_nodejs_external_memory_bytes = 0;
      let strapi_nodejs_heap_size_total_bytes = 0;
      let strapi_nodejs_heap_size_used_bytes = 0;

      for (const item of lines) {
        const objAux = item.split(' ');

        if (objAux[0] === 'strapi_process_resident_memory_bytes') {
          strapi_process_resident_memory_bytes = Number(objAux[1]);
        }

        if (objAux[0] === 'strapi_process_virtual_memory_bytes') {
          strapi_process_virtual_memory_bytes = Number(objAux[1]);
        }

        if (objAux[0] === 'strapi_nodejs_heap_size_total_bytes') {
          strapi_nodejs_heap_size_total_bytes = Number(objAux[1]);
        }

        if (objAux[0] === 'strapi_nodejs_external_memory_bytes') {
          strapi_nodejs_external_memory_bytes = Number(objAux[1]);
        }

        if (objAux[0] === 'strapi_nodejs_heap_size_used_bytes') {
          strapi_nodejs_heap_size_used_bytes = Number(objAux[1]);
        }
      }

      return {
        success: true,
        data: {
          normal: {
            strapi_process_resident_memory_bytes,
            strapi_process_virtual_memory_bytes,
            strapi_nodejs_heap_size_total_bytes,
            strapi_nodejs_external_memory_bytes,
            strapi_nodejs_heap_size_used_bytes,
          },
          mb: {
            strapi_process_resident_memory_bytes: convertBytesToMB(strapi_process_resident_memory_bytes),
            strapi_process_virtual_memory_bytes: convertBytesToMB(strapi_process_virtual_memory_bytes),
            strapi_nodejs_heap_size_total_bytes: convertBytesToMB(strapi_nodejs_heap_size_total_bytes),
            strapi_nodejs_external_memory_bytes: convertBytesToMB(strapi_nodejs_external_memory_bytes),
            strapi_nodejs_heap_size_used_bytes: convertBytesToMB(strapi_nodejs_heap_size_used_bytes),
          },
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },
});
