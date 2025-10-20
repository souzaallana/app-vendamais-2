import{c as L}from"./supabase-DECyEzUQ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();class q{constructor(){this.routes=new Map,this.currentRoute=null,this.middlewares=[],this.params={}}register(t,r){this.routes.set(t,r)}use(t){this.middlewares.push(t)}async navigate(t,r={}){this.params=r;for(const s of this.middlewares)if(await s(t)===!1)return;const o=this.routes.get(t);if(!o){console.error(`Route not found: ${t}`);return}this.currentRoute=t,window.history.pushState({path:t,params:r},"",t);const a=document.getElementById("app");if(a){a.innerHTML="";const s=await o(r);s instanceof HTMLElement?a.appendChild(s):typeof s=="string"&&(a.innerHTML=s)}}back(){window.history.back()}getCurrentRoute(){return this.currentRoute}getParams(){return this.params}}const u=new q;window.addEventListener("popstate",e=>{e.state&&e.state.path&&u.navigate(e.state.path,e.state.params||{})});const P="https://jnqynypefthinysddrka.supabase.co",S="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k",v=L(P,S),m={async signUp(e,t,r){const{data:o,error:a}=await v.auth.signUp({email:e,password:t,options:{data:{full_name:r}}});if(a)throw a;if(o.user){const{error:s}=await v.from("profiles").insert([{id:o.user.id,email:o.user.email,full_name:r}]);if(s)throw s}return o},async signIn(e,t){const{data:r,error:o}=await v.auth.signInWithPassword({email:e,password:t});if(o)throw o;return r},async signOut(){const{error:e}=await v.auth.signOut();if(e)throw e},async getCurrentUser(){const{data:{user:e},error:t}=await v.auth.getUser();if(t)throw t;return e},async getProfile(e){const{data:t,error:r}=await v.from("profiles").select("*").eq("id",e).maybeSingle();if(r)throw r;return t},async updateProfile(e,t){const{data:r,error:o}=await v.from("profiles").update(t).eq("id",e).select().single();if(o)throw o;return r},onAuthStateChange(e){return v.auth.onAuthStateChange((t,r)=>{e(t,r)})}},y={async createProduct(e){const t=await m.getCurrentUser();if(!t)throw new Error("User not authenticated");const{data:r,error:o}=await v.from("products").insert([{...e,user_id:t.id}]).select().single();if(o)throw o;return r},async getProducts(e={}){const t=await m.getCurrentUser();if(!t)throw new Error("User not authenticated");let r=v.from("products").select("*, product_images(*)").eq("user_id",t.id).order("created_at",{ascending:!1});e.status&&(r=r.eq("status",e.status)),e.marketplace&&(r=r.eq("marketplace",e.marketplace)),e.search&&(r=r.or(`title.ilike.%${e.search}%,description.ilike.%${e.search}%`));const{data:o,error:a}=await r;if(a)throw a;return o},async getProduct(e){const{data:t,error:r}=await v.from("products").select("*, product_images(*)").eq("id",e).single();if(r)throw r;return t},async updateProduct(e,t){const{data:r,error:o}=await v.from("products").update(t).eq("id",e).select().single();if(o)throw o;return r},async deleteProduct(e){const{error:t}=await v.from("products").delete().eq("id",e);if(t)throw t},async uploadProductImage(e,t,r=0){const o=t.name.split(".").pop(),s=`product-images/${`${e}_${r}_${Date.now()}.${o}`}`,{error:l}=await v.storage.from("products").upload(s,t);if(l)throw l;const{data:{publicUrl:g}}=v.storage.from("products").getPublicUrl(s),{data:p,error:d}=await v.from("product_images").insert([{product_id:e,image_url:g,order_index:r}]).select().single();if(d)throw d;return p},async getStats(){const e=await m.getCurrentUser();if(!e)throw new Error("User not authenticated");const{data:t,error:r}=await v.from("products").select("status, marketplace").eq("user_id",e.id);if(r)throw r;return{total:t.length,active:t.filter(a=>a.status==="active").length,paused:t.filter(a=>a.status==="paused").length,draft:t.filter(a=>a.status==="draft").length,mercadoLivre:t.filter(a=>a.marketplace==="ml").length,shopee:t.filter(a=>a.marketplace==="shopee").length}}},$={pt:{splash_loading:"Carregando...",login_title:"Bem-vindo",login_subtitle:"Faça login para continuar",login_email:"E-mail",login_password:"Senha",login_button:"Entrar",login_forgot:"Esqueceu a senha?",login_signup:"Não tem conta? Cadastre-se",login_error:"E-mail ou senha incorretos",home_title:"Início",home_stats_total:"Total de Produtos",home_stats_active:"Ativos",home_stats_ml:"Mercado Livre",home_welcome:"Olá, {{name}}!",home_quick_register:"Cadastro Rápido",home_share_title:"Compartilhar",home_marketplaces:"Marketplaces Conectados",products_title:"Produtos",products_all:"Todos",products_ml:"Mercado Livre",products_shopee:"Shopee",products_paused:"Pausados",products_search:"Buscar produtos...",products_sort:"Ordenar",products_empty:"Nenhum produto encontrado",products_add_first:"Cadastre seu primeiro produto",register_title:"Cadastrar Produto",register_photo:"Tirar Foto",register_voice:"Descrever por Voz",register_gallery:"Escolher da Galeria",register_manual:"Preencher Manual",register_coming_soon:"Em breve",photo_tips_title:"Dicas para Fotos Perfeitas",photo_tips_subtitle:"Siga estas dicas para melhorar suas vendas",photo_tips_lighting:"Boa iluminação natural",photo_tips_background:"Fundo neutro e limpo",photo_tips_angles:"Diferentes ângulos",photo_tips_details:"Detalhes importantes",photo_tips_start:"Começar",photo_capture_title:"Tire as Fotos",photo_capture_subtitle:"Tire até 3 fotos do produto",photo_capture_button:"Tirar Foto",photo_capture_gallery:"Escolher da Galeria",photo_capture_continue:"Continuar",photo_review_title:"Revisar Fotos",photo_review_subtitle:"Você pode adicionar ou remover fotos",photo_review_add:"Adicionar Foto",photo_review_continue:"Continuar",ai_processing_title:"Analisando Produto",ai_processing_subtitle:"Nossa IA está criando a melhor descrição",ai_processing_analyzing:"Analisando imagens",ai_processing_category:"Identificando categoria",ai_processing_description:"Gerando descrição",ai_processing_price:"Sugerindo preço",product_review_title:"Revisar Produto",product_review_subtitle:"Confira e ajuste as informações",product_review_title_label:"Título",product_review_description_label:"Descrição",product_review_category_label:"Categoria",product_review_price_label:"Preço",product_review_save:"Salvar Produto",success_title:"Produto Cadastrado!",success_subtitle:"Seu produto foi cadastrado com sucesso",success_share_title:"Compartilhar",success_marketplaces_title:"Publicar em Marketplaces",success_new_product:"Cadastrar Outro",success_view_products:"Ver Meus Produtos",help_title:"Ajuda",help_search:"Como podemos ajudar?",help_quick_title:"Ajuda Rápida",help_whatsapp:"WhatsApp",help_email:"E-mail",help_videos:"Vídeos Tutoriais",help_faq_title:"Perguntas Frequentes",profile_title:"Perfil",profile_marketplaces:"Vender em Marketplaces",profile_limit:"Solicitação de Limite",profile_invoices:"Central de Faturas",profile_language:"Idioma",profile_tour:"Tour Guiado",profile_settings:"Configurações",profile_logout:"Sair",nav_home:"Início",nav_products:"Produtos",nav_register:"Cadastrar",nav_help:"Dicas",nav_profile:"Perfil",common_cancel:"Cancelar",common_confirm:"Confirmar",common_save:"Salvar",common_delete:"Excluir",common_edit:"Editar",common_back:"Voltar",common_next:"Próximo",common_loading:"Carregando...",common_error:"Ocorreu um erro",common_success:"Sucesso!",common_coming_soon:"🔒 Funcionalidade em desenvolvimento"},en:{splash_loading:"Loading...",login_title:"Welcome",login_subtitle:"Sign in to continue",login_email:"Email",login_password:"Password",login_button:"Sign In",login_forgot:"Forgot password?",login_signup:"Don't have an account? Sign up",login_error:"Incorrect email or password",home_title:"Home",home_stats_total:"Total Products",home_stats_active:"Active",home_stats_ml:"Mercado Libre",home_welcome:"Hello, {{name}}!",home_quick_register:"Quick Register",home_share_title:"Share",home_marketplaces:"Connected Marketplaces",products_title:"Products",products_all:"All",products_ml:"Mercado Libre",products_shopee:"Shopee",products_paused:"Paused",products_search:"Search products...",products_sort:"Sort",products_empty:"No products found",products_add_first:"Register your first product",register_title:"Register Product",register_photo:"Take Photo",register_voice:"Describe by Voice",register_gallery:"Choose from Gallery",register_manual:"Fill Manually",register_coming_soon:"Coming soon",photo_tips_title:"Tips for Perfect Photos",photo_tips_subtitle:"Follow these tips to improve your sales",photo_tips_lighting:"Good natural lighting",photo_tips_background:"Neutral and clean background",photo_tips_angles:"Different angles",photo_tips_details:"Important details",photo_tips_start:"Start",photo_capture_title:"Take Photos",photo_capture_subtitle:"Take up to 3 product photos",photo_capture_button:"Take Photo",photo_capture_gallery:"Choose from Gallery",photo_capture_continue:"Continue",photo_review_title:"Review Photos",photo_review_subtitle:"You can add or remove photos",photo_review_add:"Add Photo",photo_review_continue:"Continue",ai_processing_title:"Analyzing Product",ai_processing_subtitle:"Our AI is creating the best description",ai_processing_analyzing:"Analyzing images",ai_processing_category:"Identifying category",ai_processing_description:"Generating description",ai_processing_price:"Suggesting price",product_review_title:"Review Product",product_review_subtitle:"Check and adjust the information",product_review_title_label:"Title",product_review_description_label:"Description",product_review_category_label:"Category",product_review_price_label:"Price",product_review_save:"Save Product",success_title:"Product Registered!",success_subtitle:"Your product was successfully registered",success_share_title:"Share",success_marketplaces_title:"Publish on Marketplaces",success_new_product:"Register Another",success_view_products:"View My Products",help_title:"Help",help_search:"How can we help?",help_quick_title:"Quick Help",help_whatsapp:"WhatsApp",help_email:"Email",help_videos:"Tutorial Videos",help_faq_title:"Frequently Asked Questions",profile_title:"Profile",profile_marketplaces:"Sell on Marketplaces",profile_limit:"Limit Request",profile_invoices:"Invoice Center",profile_language:"Language",profile_tour:"Guided Tour",profile_settings:"Settings",profile_logout:"Sign Out",nav_home:"Home",nav_products:"Products",nav_register:"Register",nav_help:"Tips",nav_profile:"Profile",common_cancel:"Cancel",common_confirm:"Confirm",common_save:"Save",common_delete:"Delete",common_edit:"Edit",common_back:"Back",common_next:"Next",common_loading:"Loading...",common_error:"An error occurred",common_success:"Success!",common_coming_soon:"🔒 Feature in development"},es:{splash_loading:"Cargando...",login_title:"Bienvenido",login_subtitle:"Inicia sesión para continuar",login_email:"Correo electrónico",login_password:"Contraseña",login_button:"Iniciar Sesión",login_forgot:"¿Olvidaste tu contraseña?",login_signup:"¿No tienes cuenta? Regístrate",login_error:"Correo o contraseña incorrectos",home_title:"Inicio",home_stats_total:"Total de Productos",home_stats_active:"Activos",home_stats_ml:"Mercado Libre",home_welcome:"¡Hola, {{name}}!",home_quick_register:"Registro Rápido",home_share_title:"Compartir",home_marketplaces:"Marketplaces Conectados",products_title:"Productos",products_all:"Todos",products_ml:"Mercado Libre",products_shopee:"Shopee",products_paused:"Pausados",products_search:"Buscar productos...",products_sort:"Ordenar",products_empty:"No se encontraron productos",products_add_first:"Registra tu primer producto",register_title:"Registrar Producto",register_photo:"Tomar Foto",register_voice:"Describir por Voz",register_gallery:"Elegir de la Galería",register_manual:"Llenar Manual",register_coming_soon:"Próximamente",photo_tips_title:"Consejos para Fotos Perfectas",photo_tips_subtitle:"Sigue estos consejos para mejorar tus ventas",photo_tips_lighting:"Buena iluminación natural",photo_tips_background:"Fondo neutro y limpio",photo_tips_angles:"Diferentes ángulos",photo_tips_details:"Detalles importantes",photo_tips_start:"Comenzar",photo_capture_title:"Tomar Fotos",photo_capture_subtitle:"Toma hasta 3 fotos del producto",photo_capture_button:"Tomar Foto",photo_capture_gallery:"Elegir de la Galería",photo_capture_continue:"Continuar",photo_review_title:"Revisar Fotos",photo_review_subtitle:"Puedes agregar o eliminar fotos",photo_review_add:"Agregar Foto",photo_review_continue:"Continuar",ai_processing_title:"Analizando Producto",ai_processing_subtitle:"Nuestra IA está creando la mejor descripción",ai_processing_analyzing:"Analizando imágenes",ai_processing_category:"Identificando categoría",ai_processing_description:"Generando descripción",ai_processing_price:"Sugiriendo precio",product_review_title:"Revisar Producto",product_review_subtitle:"Verifica y ajusta la información",product_review_title_label:"Título",product_review_description_label:"Descripción",product_review_category_label:"Categoría",product_review_price_label:"Precio",product_review_save:"Guardar Producto",success_title:"¡Producto Registrado!",success_subtitle:"Tu producto fue registrado con éxito",success_share_title:"Compartir",success_marketplaces_title:"Publicar en Marketplaces",success_new_product:"Registrar Otro",success_view_products:"Ver Mis Productos",help_title:"Ayuda",help_search:"¿Cómo podemos ayudarte?",help_quick_title:"Ayuda Rápida",help_whatsapp:"WhatsApp",help_email:"Correo",help_videos:"Videos Tutoriales",help_faq_title:"Preguntas Frecuentes",profile_title:"Perfil",profile_marketplaces:"Vender en Marketplaces",profile_limit:"Solicitud de Límite",profile_invoices:"Centro de Facturas",profile_language:"Idioma",profile_tour:"Tour Guiado",profile_settings:"Configuraciones",profile_logout:"Salir",nav_home:"Inicio",nav_products:"Productos",nav_register:"Registrar",nav_help:"Consejos",nav_profile:"Perfil",common_cancel:"Cancelar",common_confirm:"Confirmar",common_save:"Guardar",common_delete:"Eliminar",common_edit:"Editar",common_back:"Volver",common_next:"Siguiente",common_loading:"Cargando...",common_error:"Ocurrió un error",common_success:"¡Éxito!",common_coming_soon:"🔒 Funcionalidad en desarrollo"}};class M{constructor(){this.currentLanguage=localStorage.getItem("language")||"pt"}setLanguage(t){$[t]&&(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChange",{detail:t})))}getLanguage(){return this.currentLanguage}t(t,r={}){const o=t.split(".");let a=$[this.currentLanguage];for(const l of o)a=a?.[l];if(!a)return console.warn(`Translation not found for key: ${t}`),t;let s=a;return Object.keys(r).forEach(l=>{s=s.replace(`{{${l}}}`,r[l])}),s}}const i=new M;function T(){const e=document.createElement("div");return e.className="splash-screen",e.innerHTML=`
    <style>
      .splash-screen {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--gradient-purple-blue);
        color: white;
      }

      .splash-logo {
        font-size: 48px;
        font-weight: 900;
        margin-bottom: var(--spacing-8);
        letter-spacing: -1px;
        text-align: center;
      }

      .splash-loader {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
        position: relative;
      }

      .splash-loader-bar {
        height: 100%;
        background: white;
        border-radius: 2px;
        animation: loading 1.5s ease-in-out;
        transform-origin: left;
      }

      @keyframes loading {
        0% {
          transform: scaleX(0);
        }
        100% {
          transform: scaleX(1);
        }
      }

      .splash-text {
        margin-top: var(--spacing-6);
        font-size: 14px;
        font-weight: 300;
        opacity: 0.9;
      }
    </style>

    <div class="splash-logo">Lojista</div>
    <div class="splash-loader">
      <div class="splash-loader-bar"></div>
    </div>
    <div class="splash-text">${i.t("splash_loading")}</div>
  `,e}function f(e,t="info"){const r=document.querySelector(".snackbar");r&&r.remove();const o=document.createElement("div");o.className=`snackbar ${t}`,o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("fade-out"),setTimeout(()=>o.remove(),300)},3e3)}function R(e,t="BRL"){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:t}).format(e)}function z(e,t){let r;return function(...a){const s=()=>{clearTimeout(r),e(...a)};clearTimeout(r),r=setTimeout(s,t)}}function A(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function I(e){return e.length>=6}async function j(e,t=1200,r=.8){return new Promise((o,a)=>{const s=new FileReader;s.readAsDataURL(e),s.onload=l=>{const g=new Image;g.src=l.target.result,g.onload=()=>{const p=document.createElement("canvas");let d=g.width,c=g.height;d>t&&(c=c*t/d,d=t),p.width=d,p.height=c,p.getContext("2d").drawImage(g,0,0,d,c),p.toBlob(b=>{o(new File([b],e.name,{type:"image/jpeg"}))},"image/jpeg",r)},g.onerror=a},s.onerror=a})}function w(e,t={}){const r=document.createElement("div");r.className="modal-overlay fade-in",r.onclick=s=>{s.target===r&&!t.preventClose&&a()};const o=document.createElement("div");o.className="modal-content slide-up",typeof e=="string"?o.innerHTML=e:o.appendChild(e),r.appendChild(o),document.body.appendChild(r);function a(){r.classList.add("fade-out"),setTimeout(()=>r.remove(),300)}return{overlay:r,modal:o,close:a}}const n={home:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"></path><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" x2="12" y1="22" y2="12"></line></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',lightbulb:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',camera:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>',mic:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>',image:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>',search:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>',share:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" x2="12" y1="2" y2="15"></line></svg>',arrowRight:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',globe:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',sparkles:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>'};async function C(){const e=document.createElement("div");e.className="login-screen",e.innerHTML=`
    <style>
      .login-screen {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .login-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-12) var(--spacing-6) var(--spacing-8);
        text-align: center;
        border-radius: 0 0 32px 32px;
      }

      .login-header h1 {
        color: white;
        font-size: 32px;
        font-weight: 900;
        margin-bottom: var(--spacing-2);
      }

      .login-header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        font-weight: 300;
      }

      .login-content {
        flex: 1;
        padding: var(--spacing-8) var(--spacing-6);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
      }

      .login-demo-info {
        background: #EFF6FF;
        border: 2px solid #DBEAFE;
        border-radius: var(--border-radius);
        padding: var(--spacing-4);
        text-align: center;
        color: #1E40AF;
        font-size: 14px;
      }

      .login-demo-info strong {
        display: block;
        margin-bottom: var(--spacing-2);
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-5);
      }

      .login-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
        margin-top: var(--spacing-4);
      }

      .login-forgot {
        text-align: center;
        font-size: 14px;
        color: var(--primary-purple);
        margin-top: var(--spacing-2);
        opacity: 0.5;
        cursor: not-allowed;
      }
    </style>

    <div class="login-header">
      <h1>${i.t("login_title")}</h1>
      <p>${i.t("login_subtitle")}</p>
    </div>

    <div class="login-content">
      <div class="login-demo-info">
        <strong>Demo Account</strong>
        <div>Email: demo@lojista.app</div>
        <div>Password: demo123</div>
      </div>

      <form class="login-form" id="loginForm">
        <div class="input-group">
          <label class="input-label" for="email">${i.t("login_email")}</label>
          <input
            type="email"
            id="email"
            class="input-field"
            placeholder="seu@email.com"
            value="demo@lojista.app"
            required
          />
          <span class="error-message" id="emailError"></span>
        </div>

        <div class="input-group">
          <label class="input-label" for="password">${i.t("login_password")}</label>
          <input
            type="password"
            id="password"
            class="input-field"
            placeholder="••••••"
            value="demo123"
            required
          />
          <span class="error-message" id="passwordError"></span>
        </div>

        <div class="login-actions">
          <button type="submit" class="btn btn-primary btn-lg">
            ${i.t("login_button")}
          </button>
          <div class="login-forgot">${i.t("login_forgot")}</div>
        </div>
      </form>
    </div>
  `;const t=e.querySelector("#loginForm"),r=e.querySelector("#email"),o=e.querySelector("#password"),a=e.querySelector("#emailError"),s=e.querySelector("#passwordError"),l=t.querySelector('button[type="submit"]');return t.addEventListener("submit",async g=>{g.preventDefault(),a.textContent="",s.textContent="",r.classList.remove("input-error"),o.classList.remove("input-error");const p=r.value.trim(),d=o.value;let c=!1;if(A(p)||(a.textContent="Email inválido",r.classList.add("input-error"),c=!0),I(d)||(s.textContent="Senha deve ter no mínimo 6 caracteres",o.classList.add("input-error"),c=!0),!c){l.disabled=!0,l.textContent=i.t("common_loading");try{let h=await m.signIn(p,d);h||(h=(await m.signUp(p,d,"Lili Cliente")).user),f(i.t("common_success"),"success"),u.navigate("/home")}catch(h){console.error("Login error:",h),f(i.t("login_error"),"error"),l.disabled=!1,l.textContent=i.t("login_button")}}}),e}function x(){const e=document.createElement("nav");e.className="bottom-nav",e.innerHTML=`
    <style>
      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
        z-index: var(--z-navbar);
      }

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        color: var(--text-secondary);
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 12px;
        font-weight: 500;
        min-width: 60px;
      }

      .nav-item svg {
        width: 24px;
        height: 24px;
      }

      .nav-item.active {
        color: var(--primary-purple);
      }

      .nav-item:not(.nav-center):hover {
        color: var(--primary-purple);
        transform: translateY(-2px);
      }

      .nav-center {
        position: relative;
        margin: 0 8px;
      }

      .nav-fab {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--gradient-purple);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.2s ease;
        margin-bottom: 20px;
      }

      .nav-fab:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: var(--shadow-xl);
      }

      .nav-fab svg {
        width: 28px;
        height: 28px;
      }
    </style>

    <button class="nav-item" data-route="/home">
      ${n.home}
      <span>${i.t("nav_home")}</span>
    </button>

    <button class="nav-item" data-route="/products">
      ${n.package}
      <span>${i.t("nav_products")}</span>
    </button>

    <div class="nav-center">
      <button class="nav-fab" id="nav-register">
        ${n.plus}
      </button>
    </div>

    <button class="nav-item" data-route="/help">
      ${n.lightbulb}
      <span>${i.t("nav_help")}</span>
    </button>

    <button class="nav-item" data-route="/profile">
      ${n.user}
      <span>${i.t("nav_profile")}</span>
    </button>
  `,e.querySelectorAll(".nav-item").forEach(o=>{o.addEventListener("click",()=>{const a=o.dataset.route;a&&(u.navigate(a),t(a))})}),e.querySelector("#nav-register").addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("openRegisterModal"))});function t(o){e.querySelectorAll(".nav-item").forEach(a=>{a.dataset.route===o?a.classList.add("active"):a.classList.remove("active")})}const r=u.getCurrentRoute();return r&&t(r),e}function F(){const e=document.querySelector(".bottom-nav");if(e){const t=e.querySelectorAll(".nav-item span");t[0].textContent=i.t("nav_home"),t[1].textContent=i.t("nav_products"),t[2].textContent=i.t("nav_help"),t[3].textContent=i.t("nav_profile")}}async function B(){const e=await m.getCurrentUser(),t=e?await m.getProfile(e.id):null,r=await y.getStats().catch(()=>({total:0,active:0,mercadoLivre:0})),o=document.createElement("div");return o.className="home-screen",o.innerHTML=`
    <style>
      .home-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .home-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-6);
        padding-top: calc(var(--spacing-6) + env(safe-area-inset-top));
        border-radius: 0 0 24px 24px;
      }

      .home-header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
      }

      .home-welcome {
        font-size: 24px;
        font-weight: 700;
      }

      .language-selector {
        display: flex;
        gap: var(--spacing-2);
        background: rgba(255, 255, 255, 0.2);
        padding: 4px;
        border-radius: 8px;
      }

      .lang-btn {
        padding: 6px 12px;
        background: transparent;
        border: none;
        color: white;
        font-size: 12px;
        font-weight: 500;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .lang-btn.active {
        background: white;
        color: var(--primary-purple);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-3);
        margin-top: var(--spacing-4);
      }

      .stat-card {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        text-align: center;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 900;
        margin-bottom: var(--spacing-1);
      }

      .stat-label {
        font-size: 12px;
        opacity: 0.9;
        font-weight: 300;
      }

      .home-content {
        padding: var(--spacing-6);
      }

      .section {
        margin-bottom: var(--spacing-8);
      }

      .section-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: var(--spacing-4);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
      }

      .section-title svg {
        width: 24px;
        height: 24px;
        color: var(--primary-purple);
      }

      .quick-actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-4);
      }

      .action-card {
        background: white;
        padding: var(--spacing-5);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        text-align: center;
        transition: all 0.2s;
        cursor: pointer;
        border: 2px solid transparent;
      }

      .action-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary-purple);
      }

      .action-card.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-card.disabled:hover {
        transform: none;
        border-color: transparent;
      }

      .action-icon {
        width: 48px;
        height: 48px;
        background: var(--gradient-purple);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-3);
      }

      .action-icon svg {
        width: 24px;
        height: 24px;
      }

      .action-title {
        font-weight: 600;
        margin-bottom: var(--spacing-1);
      }

      .action-subtitle {
        font-size: 13px;
        color: var(--text-secondary);
      }

      .marketplace-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-3);
      }

      .marketplace-card {
        background: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
      }

      .marketplace-logo {
        width: 40px;
        height: 40px;
        background: var(--bg-gray-100);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
      }

      .marketplace-info h4 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .marketplace-status {
        font-size: 12px;
        color: #10B981;
        font-weight: 500;
      }

      .marketplace-status.coming-soon {
        color: var(--text-secondary);
      }
    </style>

    <div class="home-header">
      <div class="home-header-top">
        <div class="home-welcome">${i.t("home_welcome",{name:t?.full_name||"Lili"})}</div>
        <div class="language-selector">
          <button class="lang-btn ${i.getLanguage()==="pt"?"active":""}" data-lang="pt">PT</button>
          <button class="lang-btn ${i.getLanguage()==="en"?"active":""}" data-lang="en">EN</button>
          <button class="lang-btn ${i.getLanguage()==="es"?"active":""}" data-lang="es">ES</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${r.total}</div>
          <div class="stat-label">${i.t("home_stats_total")}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${r.active}</div>
          <div class="stat-label">${i.t("home_stats_active")}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${r.mercadoLivre}</div>
          <div class="stat-label">${i.t("home_stats_ml")}</div>
        </div>
      </div>
    </div>

    <div class="home-content">
      <section class="section">
        <h2 class="section-title">
          ${n.sparkles}
          ${i.t("home_quick_register")}
        </h2>
        <div class="quick-actions">
          <div class="action-card" data-action="photo">
            <div class="action-icon">${n.camera}</div>
            <div class="action-title">${i.t("register_photo")}</div>
            <div class="action-subtitle">Modo IA</div>
          </div>
          <div class="action-card disabled" data-action="voice">
            <div class="action-icon">${n.mic}</div>
            <div class="action-title">${i.t("register_voice")}</div>
            <div class="action-subtitle">${i.t("register_coming_soon")}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">
          ${n.share}
          ${i.t("home_marketplaces")}
        </h2>
        <div class="marketplace-grid">
          <div class="marketplace-card">
            <div class="marketplace-logo" style="background: #FFE600; color: #000;">ML</div>
            <div class="marketplace-info">
              <h4>Mercado Livre</h4>
              <div class="marketplace-status">Conectado</div>
            </div>
          </div>
          <div class="marketplace-card">
            <div class="marketplace-logo" style="background: #EE4D2D; color: #fff;">S</div>
            <div class="marketplace-info">
              <h4>Shopee</h4>
              <div class="marketplace-status coming-soon">${i.t("register_coming_soon")}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,o.querySelectorAll(".lang-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.lang;i.setLanguage(s),f(`Idioma alterado para ${s.toUpperCase()}`,"success")})}),o.querySelectorAll(".action-card:not(.disabled)").forEach(a=>{a.addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("openRegisterModal"))})}),o.querySelectorAll(".action-card.disabled").forEach(a=>{a.addEventListener("click",()=>{f(i.t("common_coming_soon"),"warning")})}),o.appendChild(x()),o}async function N(){let e=[],t="all",r="";const o=document.createElement("div");o.className="products-screen",o.innerHTML=`
    <style>
      .products-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .products-header {
        background: white;
        padding: var(--spacing-6);
        padding-top: calc(var(--spacing-6) + env(safe-area-inset-top));
        box-shadow: var(--shadow-sm);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .products-header h1 {
        font-size: 28px;
        margin-bottom: var(--spacing-4);
      }

      .search-box {
        position: relative;
        margin-bottom: var(--spacing-4);
      }

      .search-box input {
        width: 100%;
        padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) 44px;
        border: 2px solid var(--border-gray);
        border-radius: var(--border-radius);
        font-size: 16px;
      }

      .search-box svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
      }

      .filter-tabs {
        display: flex;
        gap: var(--spacing-2);
        overflow-x: auto;
        padding-bottom: var(--spacing-2);
      }

      .filter-tabs::-webkit-scrollbar {
        display: none;
      }

      .filter-tab {
        padding: var(--spacing-2) var(--spacing-4);
        background: var(--bg-gray-100);
        border: 2px solid transparent;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
      }

      .filter-tab.active {
        background: var(--primary-purple);
        color: white;
      }

      .products-content {
        padding: var(--spacing-4);
      }

      .products-grid {
        display: grid;
        gap: var(--spacing-4);
      }

      .product-card {
        background: white;
        border-radius: var(--border-radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: all 0.2s;
      }

      .product-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .product-image {
        width: 100%;
        height: 200px;
        background: var(--bg-gray-100);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        position: relative;
        overflow: hidden;
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-badge {
        position: absolute;
        top: var(--spacing-2);
        right: var(--spacing-2);
        padding: 4px 8px;
        background: var(--primary-purple);
        color: white;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .product-info {
        padding: var(--spacing-4);
      }

      .product-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: var(--spacing-2);
        color: var(--text-primary);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-description {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-3);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .product-price {
        font-size: 20px;
        font-weight: 700;
        color: var(--primary-purple);
      }

      .product-marketplace {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--text-secondary);
      }

      .empty-state {
        text-align: center;
        padding: var(--spacing-12) var(--spacing-6);
      }

      .empty-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--spacing-4);
        color: var(--text-secondary);
        opacity: 0.3;
      }

      .empty-icon svg {
        width: 100%;
        height: 100%;
      }

      .empty-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: var(--spacing-2);
      }

      .empty-description {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-6);
      }
    </style>

    <div class="products-header">
      <h1>${i.t("products_title")}</h1>

      <div class="search-box">
        ${n.search}
        <input
          type="text"
          id="searchInput"
          placeholder="${i.t("products_search")}"
        />
      </div>

      <div class="filter-tabs">
        <button class="filter-tab active" data-filter="all">${i.t("products_all")}</button>
        <button class="filter-tab" data-filter="ml">${i.t("products_ml")}</button>
        <button class="filter-tab" data-filter="shopee">${i.t("products_shopee")}</button>
        <button class="filter-tab" data-filter="paused">${i.t("products_paused")}</button>
      </div>
    </div>

    <div class="products-content">
      <div class="products-grid" id="productsGrid"></div>
    </div>
  `;const a=o.querySelector("#productsGrid"),s=o.querySelector("#searchInput"),l=o.querySelectorAll(".filter-tab");async function g(){try{const c={};t!=="all"&&(t==="paused"?c.status="paused":c.marketplace=t),r&&(c.search=r),e=await y.getProducts(c),p()}catch(c){console.error("Error loading products:",c),d()}}function p(){if(e.length===0){d();return}a.innerHTML=e.map(c=>{const h=c.product_images?.[0]?.image_url,b=c.price?R(c.price):"-",k=c.marketplace==="ml"?"ML":c.marketplace?.toUpperCase()||"";return`
        <div class="product-card">
          <div class="product-image">
            ${h?`<img src="${h}" alt="${c.title}">`:n.image}
            ${c.is_ai_generated?'<div class="product-badge">IA</div>':""}
          </div>
          <div class="product-info">
            <h3 class="product-title">${c.title}</h3>
            <p class="product-description">${c.description}</p>
            <div class="product-footer">
              <div class="product-price">${b}</div>
              ${k?`<div class="product-marketplace">${k}</div>`:""}
            </div>
          </div>
        </div>
      `}).join("")}function d(){a.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">${n.package}</div>
        <h2 class="empty-title">${i.t("products_empty")}</h2>
        <p class="empty-description">${i.t("products_add_first")}</p>
        <button class="btn btn-primary" onclick="window.dispatchEvent(new CustomEvent('openRegisterModal'))">
          ${n.camera}
          ${i.t("register_photo")}
        </button>
      </div>
    `}return l.forEach(c=>{c.addEventListener("click",()=>{l.forEach(h=>h.classList.remove("active")),c.classList.add("active"),t=c.dataset.filter,g()})}),s.addEventListener("input",z(c=>{r=c.target.value.trim(),g()},500)),await g(),o.appendChild(x()),o}function H(){const e=document.createElement("div");return e.className="help-screen",e.innerHTML=`
    <style>
      .help-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .help-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-6);
        padding-top: calc(var(--spacing-6) + env(safe-area-inset-top));
      }

      .help-header h1 {
        color: white;
        font-size: 28px;
        margin-bottom: var(--spacing-4);
      }

      .help-search {
        position: relative;
      }

      .help-search input {
        width: 100%;
        padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) 44px;
        border: none;
        border-radius: var(--border-radius);
        font-size: 16px;
      }

      .help-search svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
      }

      .help-content {
        padding: var(--spacing-6);
      }

      .help-section {
        margin-bottom: var(--spacing-8);
      }

      .help-section-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: var(--spacing-4);
      }

      .quick-help-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-3);
      }

      .quick-help-card {
        background: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        opacity: 0.5;
      }

      .quick-help-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .quick-help-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto var(--spacing-2);
        color: var(--primary-purple);
      }

      .quick-help-icon svg {
        width: 100%;
        height: 100%;
      }

      .quick-help-title {
        font-size: 14px;
        font-weight: 600;
      }

      .faq-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .faq-item {
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
      }

      .faq-question {
        padding: var(--spacing-4);
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;
      }

      .faq-question:hover {
        background: var(--bg-gray-50);
      }

      .faq-answer {
        padding: 0 var(--spacing-4) var(--spacing-4);
        color: var(--text-secondary);
        display: none;
      }

      .faq-item.open .faq-answer {
        display: block;
      }
    </style>

    <div class="help-header">
      <h1>${i.t("help_title")}</h1>
      <div class="help-search">
        ${n.search}
        <input
          type="text"
          placeholder="${i.t("help_search")}"
          disabled
        />
      </div>
    </div>

    <div class="help-content">
      <section class="help-section">
        <h2 class="help-section-title">${i.t("help_quick_title")}</h2>
        <div class="quick-help-grid">
          <div class="quick-help-card">
            <div class="quick-help-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="quick-help-title">${i.t("help_whatsapp")}</div>
          </div>

          <div class="quick-help-card">
            <div class="quick-help-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div class="quick-help-title">${i.t("help_email")}</div>
          </div>

          <div class="quick-help-card">
            <div class="quick-help-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect width="15" height="14" x="1" y="5" rx="2" ry="2"></rect>
              </svg>
            </div>
            <div class="quick-help-title">${i.t("help_videos")}</div>
          </div>
        </div>
      </section>

      <section class="help-section">
        <h2 class="help-section-title">${i.t("help_faq_title")}</h2>
        <div class="faq-list">
          <div class="faq-item">
            <div class="faq-question">
              <span>Como cadastrar um produto?</span>
              ${n.arrowRight}
            </div>
            <div class="faq-answer">
              Use o botão + na navegação inferior e escolha "Tirar Foto". Nossa IA irá analisar as imagens e criar automaticamente o cadastro.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Como conectar marketplaces?</span>
              ${n.arrowRight}
            </div>
            <div class="faq-answer">
              Funcionalidade em desenvolvimento. Em breve você poderá conectar Mercado Livre, Shopee e outros marketplaces.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Quantas fotos posso adicionar?</span>
              ${n.arrowRight}
            </div>
            <div class="faq-answer">
              Você pode adicionar até 3 fotos por produto para melhor visualização.
            </div>
          </div>
        </div>
      </section>
    </div>
  `,e.querySelectorAll(".quick-help-card").forEach(t=>{t.addEventListener("click",()=>{f(i.t("common_coming_soon"),"warning")})}),e.querySelectorAll(".faq-question").forEach(t=>{t.addEventListener("click",()=>{t.parentElement.classList.toggle("open")})}),e.appendChild(x()),e}async function U(){const e=await m.getCurrentUser(),t=e?await m.getProfile(e.id):null,r=document.createElement("div");return r.className="profile-screen",r.innerHTML=`
    <style>
      .profile-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .profile-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-8) var(--spacing-6);
        padding-top: calc(var(--spacing-8) + env(safe-area-inset-top));
        text-align: center;
      }

      .profile-avatar {
        width: 80px;
        height: 80px;
        background: white;
        color: var(--primary-purple);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-4);
        font-size: 32px;
        font-weight: 700;
      }

      .profile-name {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-1);
      }

      .profile-email {
        font-size: 14px;
        opacity: 0.9;
      }

      .profile-content {
        padding: var(--spacing-6);
      }

      .profile-menu {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
      }

      .profile-menu-item {
        background: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: var(--shadow-sm);
      }

      .profile-menu-item:hover {
        transform: translateX(4px);
        box-shadow: var(--shadow-md);
      }

      .profile-menu-item.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .profile-menu-item.disabled:hover {
        transform: none;
      }

      .profile-menu-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
      }

      .profile-menu-icon {
        width: 40px;
        height: 40px;
        background: var(--bg-gray-50);
        color: var(--primary-purple);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .profile-menu-icon svg {
        width: 20px;
        height: 20px;
      }

      .profile-menu-info {
        display: flex;
        flex-direction: column;
      }

      .profile-menu-title {
        font-weight: 600;
        margin-bottom: 2px;
      }

      .profile-menu-subtitle {
        font-size: 12px;
        color: var(--text-secondary);
      }

      .profile-menu-right svg {
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
      }

      .profile-menu-item.danger {
        border: 2px solid #FEE2E2;
      }

      .profile-menu-item.danger .profile-menu-icon {
        background: #FEE2E2;
        color: #EF4444;
      }

      .profile-menu-item.danger .profile-menu-title {
        color: #EF4444;
      }
    </style>

    <div class="profile-header">
      <div class="profile-avatar">
        ${t?.full_name?.charAt(0).toUpperCase()||"L"}
      </div>
      <div class="profile-name">${t?.full_name||"Lili Cliente"}</div>
      <div class="profile-email">${t?.email||"demo@lojista.app"}</div>
    </div>

    <div class="profile-content">
      <div class="profile-menu">
        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i.t("profile_marketplaces")}</div>
              <div class="profile-menu-subtitle">${i.t("register_coming_soon")}</div>
            </div>
          </div>
          <div class="profile-menu-right">${n.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i.t("profile_limit")}</div>
              <div class="profile-menu-subtitle">${i.t("register_coming_soon")}</div>
            </div>
          </div>
          <div class="profile-menu-right">${n.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i.t("profile_invoices")}</div>
              <div class="profile-menu-subtitle">${i.t("register_coming_soon")}</div>
            </div>
          </div>
          <div class="profile-menu-right">${n.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">${n.globe}</div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i.t("profile_language")}</div>
              <div class="profile-menu-subtitle">${i.getLanguage().toUpperCase()}</div>
            </div>
          </div>
          <div class="profile-menu-right">${n.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" x2="12.01" y1="17" y2="17"></line>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i.t("profile_tour")}</div>
              <div class="profile-menu-subtitle">${i.t("register_coming_soon")}</div>
            </div>
          </div>
          <div class="profile-menu-right">${n.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i.t("profile_settings")}</div>
              <div class="profile-menu-subtitle">${i.t("register_coming_soon")}</div>
            </div>
          </div>
          <div class="profile-menu-right">${n.arrowRight}</div>
        </div>

        <div class="profile-menu-item danger" id="logoutBtn" style="margin-top: var(--spacing-6);">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" x2="9" y1="12" y2="12"></line>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i.t("profile_logout")}</div>
            </div>
          </div>
          <div class="profile-menu-right">${n.arrowRight}</div>
        </div>
      </div>
    </div>
  `,r.querySelectorAll(".profile-menu-item.disabled").forEach(o=>{o.addEventListener("click",()=>{f(i.t("common_coming_soon"),"warning")})}),r.querySelector("#logoutBtn").addEventListener("click",async()=>{try{await m.signOut(),f("Logout realizado com sucesso","success"),u.navigate("/login")}catch(o){console.error("Logout error:",o),f(i.t("common_error"),"error")}}),r.appendChild(x()),r}function D(){const e=document.createElement("div");e.innerHTML=`
    <style>
      .register-modal-header {
        padding: var(--spacing-6);
        text-align: center;
        border-bottom: 1px solid var(--border-gray);
      }

      .register-modal-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-2);
      }

      .register-options {
        padding: var(--spacing-6);
        display: grid;
        gap: var(--spacing-4);
      }

      .register-option {
        padding: var(--spacing-5);
        border: 2px solid var(--border-gray);
        border-radius: var(--border-radius-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      }

      .register-option:hover:not(.disabled) {
        border-color: var(--primary-purple);
        transform: translateX(4px);
      }

      .register-option.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .register-option-icon {
        width: 56px;
        height: 56px;
        background: var(--gradient-purple);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .register-option.disabled .register-option-icon {
        background: var(--bg-gray-200);
        color: var(--text-secondary);
      }

      .register-option-icon svg {
        width: 28px;
        height: 28px;
      }

      .register-option-info {
        flex: 1;
      }

      .register-option-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .register-option-subtitle {
        font-size: 14px;
        color: var(--text-secondary);
      }
    </style>

    <div class="register-modal-header">
      <h2 class="register-modal-title">${i.t("register_title")}</h2>
    </div>

    <div class="register-options">
      <div class="register-option" data-option="photo">
        <div class="register-option-icon">${n.camera}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i.t("register_photo")}</div>
          <div class="register-option-subtitle">Modo IA - Rápido e fácil</div>
        </div>
      </div>

      <div class="register-option disabled" data-option="voice">
        <div class="register-option-icon">${n.mic}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i.t("register_voice")}</div>
          <div class="register-option-subtitle">${i.t("register_coming_soon")}</div>
        </div>
      </div>

      <div class="register-option disabled" data-option="gallery">
        <div class="register-option-icon">${n.image}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i.t("register_gallery")}</div>
          <div class="register-option-subtitle">${i.t("register_coming_soon")}</div>
        </div>
      </div>

      <div class="register-option disabled" data-option="manual">
        <div class="register-option-icon">${n.edit}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i.t("register_manual")}</div>
          <div class="register-option-subtitle">${i.t("register_coming_soon")}</div>
        </div>
      </div>
    </div>
  `;const t=w(e);e.querySelectorAll(".register-option:not(.disabled)").forEach(r=>{r.addEventListener("click",()=>{t.close(),E()})}),e.querySelectorAll(".register-option.disabled").forEach(r=>{r.addEventListener("click",()=>{f(i.t("common_coming_soon"),"warning")})})}let _=[];function E(){O()}function O(){const e=document.createElement("div");e.innerHTML=`
    <style>
      .tips-container {
        padding: var(--spacing-6);
      }

      .tips-header {
        text-align: center;
        margin-bottom: var(--spacing-6);
      }

      .tips-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-2);
      }

      .tips-subtitle {
        color: var(--text-secondary);
      }

      .tips-list {
        display: grid;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-8);
      }

      .tip-item {
        display: flex;
        align-items: start;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
        background: var(--bg-gray-50);
        border-radius: var(--border-radius);
      }

      .tip-icon {
        width: 40px;
        height: 40px;
        background: var(--gradient-purple);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .tip-text {
        flex: 1;
        padding-top: 8px;
        font-weight: 500;
      }
    </style>

    <div class="tips-container">
      <div class="tips-header">
        <h2 class="tips-title">${i.t("photo_tips_title")}</h2>
        <p class="tips-subtitle">${i.t("photo_tips_subtitle")}</p>
      </div>

      <div class="tips-list">
        <div class="tip-item">
          <div class="tip-icon">${n.sparkles}</div>
          <div class="tip-text">${i.t("photo_tips_lighting")}</div>
        </div>
        <div class="tip-item">
          <div class="tip-icon">${n.check}</div>
          <div class="tip-text">${i.t("photo_tips_background")}</div>
        </div>
        <div class="tip-item">
          <div class="tip-icon">${n.camera}</div>
          <div class="tip-text">${i.t("photo_tips_angles")}</div>
        </div>
        <div class="tip-item">
          <div class="tip-icon">${n.search}</div>
          <div class="tip-text">${i.t("photo_tips_details")}</div>
        </div>
      </div>

      <button class="btn btn-primary btn-lg" style="width: 100%;" id="startCapture">
        ${i.t("photo_tips_start")}
      </button>
    </div>
  `;const t=w(e);e.querySelector("#startCapture").addEventListener("click",()=>{t.close(),V()})}function V(){_=[];const e=document.createElement("div");e.innerHTML=`
    <style>
      .capture-container {
        padding: var(--spacing-6);
      }

      .capture-header {
        text-align: center;
        margin-bottom: var(--spacing-6);
      }

      .photo-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-6);
      }

      .photo-slot {
        aspect-ratio: 1;
        background: var(--bg-gray-100);
        border: 2px dashed var(--border-gray);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .photo-slot img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-slot-empty {
        color: var(--text-secondary);
      }

      .capture-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }

      input[type="file"] {
        display: none;
      }
    </style>

    <div class="capture-container">
      <div class="capture-header">
        <h2>${i.t("photo_capture_title")}</h2>
        <p class="text-muted">${i.t("photo_capture_subtitle")}</p>
      </div>

      <div class="photo-grid" id="photoGrid">
        <div class="photo-slot"><div class="photo-slot-empty">${n.camera}</div></div>
        <div class="photo-slot"><div class="photo-slot-empty">${n.camera}</div></div>
        <div class="photo-slot"><div class="photo-slot-empty">${n.camera}</div></div>
      </div>

      <div class="capture-actions">
        <button class="btn btn-primary btn-lg" id="captureBtn">
          ${n.camera}
          ${i.t("photo_capture_button")}
        </button>
        <button class="btn btn-secondary" id="continueBtn" disabled>
          ${i.t("photo_capture_continue")}
        </button>
      </div>

      <input type="file" id="fileInput" accept="image/*" capture="environment" />
    </div>
  `;const t=w(e,{preventClose:!0}),r=e.querySelector("#fileInput"),o=e.querySelector("#captureBtn"),a=e.querySelector("#continueBtn"),s=e.querySelector("#photoGrid");o.addEventListener("click",()=>{_.length<3?r.click():f("Máximo de 3 fotos","warning")}),r.addEventListener("change",async g=>{const p=g.target.files[0];if(p)try{const d=await j(p),c=new FileReader;c.onload=h=>{_.push({file:d,preview:h.target.result}),l()},c.readAsDataURL(d)}catch{f("Erro ao processar imagem","error")}r.value=""});function l(){s.querySelectorAll(".photo-slot").forEach((p,d)=>{_[d]&&(p.innerHTML=`<img src="${_[d].preview}" alt="Foto ${d+1}">`)}),a.disabled=_.length===0,_.length>0&&(a.classList.remove("btn-secondary"),a.classList.add("btn-primary"))}a.addEventListener("click",()=>{t.close(),G()})}function G(){const e=document.createElement("div");e.innerHTML=`
    <style>
      .ai-container {
        padding: var(--spacing-8);
        text-align: center;
      }

      .ai-animation {
        width: 120px;
        height: 120px;
        margin: 0 auto var(--spacing-6);
        position: relative;
      }

      .ai-circle {
        width: 100%;
        height: 100%;
        border: 4px solid var(--bg-gray-200);
        border-top-color: var(--primary-purple);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .ai-steps {
        display: grid;
        gap: var(--spacing-3);
        margin-top: var(--spacing-8);
        text-align: left;
      }

      .ai-step {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        padding: var(--spacing-3);
        background: var(--bg-gray-50);
        border-radius: var(--border-radius);
      }

      .ai-step-icon {
        width: 24px;
        height: 24px;
        color: var(--primary-purple);
      }
    </style>

    <div class="ai-container">
      <div class="ai-animation">
        <div class="ai-circle"></div>
      </div>

      <h2>${i.t("ai_processing_title")}</h2>
      <p class="text-muted">${i.t("ai_processing_subtitle")}</p>

      <div class="ai-steps">
        <div class="ai-step">
          <div class="ai-step-icon">${n.check}</div>
          <div>${i.t("ai_processing_analyzing")}</div>
        </div>
        <div class="ai-step">
          <div class="ai-step-icon">${n.check}</div>
          <div>${i.t("ai_processing_category")}</div>
        </div>
        <div class="ai-step">
          <div class="ai-step-icon">${n.check}</div>
          <div>${i.t("ai_processing_description")}</div>
        </div>
        <div class="ai-step">
          <div class="ai-step-icon">${n.check}</div>
          <div>${i.t("ai_processing_price")}</div>
        </div>
      </div>
    </div>
  `;const t=w(e,{preventClose:!0});setTimeout(()=>{t.close(),Y()},3e3)}function Y(){const e={title:"Tênis Esportivo Nike Air Max Confortável",description:"Tênis esportivo de alta qualidade, ideal para corrida e caminhada. Tecnologia Air Max para máximo conforto. Cores vibrantes e design moderno.",category:"Calçados > Tênis Esportivos",price:299.9},t=document.createElement("div");t.innerHTML=`
    <style>
      .review-container {
        padding: var(--spacing-6);
      }

      .review-header {
        text-align: center;
        margin-bottom: var(--spacing-6);
      }

      .review-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-5);
      }

      textarea {
        min-height: 100px;
        resize: vertical;
      }
    </style>

    <div class="review-container">
      <div class="review-header">
        <h2>${i.t("product_review_title")}</h2>
        <p class="text-muted">${i.t("product_review_subtitle")}</p>
      </div>

      <form class="review-form" id="reviewForm">
        <div class="input-group">
          <label class="input-label">${i.t("product_review_title_label")}</label>
          <input type="text" class="input-field" id="productTitle" value="${e.title}" required />
        </div>

        <div class="input-group">
          <label class="input-label">${i.t("product_review_description_label")}</label>
          <textarea class="input-field" id="productDescription" required>${e.description}</textarea>
        </div>

        <div class="input-group">
          <label class="input-label">${i.t("product_review_category_label")}</label>
          <input type="text" class="input-field" id="productCategory" value="${e.category}" required />
        </div>

        <div class="input-group">
          <label class="input-label">${i.t("product_review_price_label")}</label>
          <input type="number" class="input-field" id="productPrice" value="${e.price}" step="0.01" required />
        </div>

        <button type="submit" class="btn btn-primary btn-lg">
          ${i.t("product_review_save")}
        </button>
      </form>
    </div>
  `;const r=w(t,{preventClose:!0}),o=t.querySelector("#reviewForm");o.addEventListener("submit",async a=>{a.preventDefault();const s=o.querySelector('button[type="submit"]');s.disabled=!0,s.textContent=i.t("common_loading");try{const l={title:t.querySelector("#productTitle").value,description:t.querySelector("#productDescription").value,category:t.querySelector("#productCategory").value,price:parseFloat(t.querySelector("#productPrice").value),status:"active",is_ai_generated:!0},g=await y.createProduct(l);for(let p=0;p<_.length;p++)await y.uploadProductImage(g.id,_[p].file,p);r.close(),X()}catch(l){console.error("Error saving product:",l),f(i.t("common_error"),"error"),s.disabled=!1,s.textContent=i.t("product_review_save")}})}function X(){const e=document.createElement("div");e.innerHTML=`
    <style>
      .success-container {
        padding: var(--spacing-8);
        text-align: center;
      }

      .success-icon {
        width: 80px;
        height: 80px;
        background: var(--gradient-success);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-6);
      }

      .success-icon svg {
        width: 48px;
        height: 48px;
      }

      .success-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
        margin-top: var(--spacing-8);
      }
    </style>

    <div class="success-container">
      <div class="success-icon">${n.check}</div>
      <h2>${i.t("success_title")}</h2>
      <p class="text-muted">${i.t("success_subtitle")}</p>

      <div class="success-actions">
        <button class="btn btn-primary btn-lg" id="viewProducts">
          ${n.package}
          ${i.t("success_view_products")}
        </button>
        <button class="btn btn-outline" id="newProduct">
          ${n.plus}
          ${i.t("success_new_product")}
        </button>
      </div>
    </div>
  `;const t=w(e);e.querySelector("#viewProducts").addEventListener("click",()=>{t.close(),u.navigate("/products")}),e.querySelector("#newProduct").addEventListener("click",()=>{t.close(),E()})}window.addEventListener("openRegisterModal",D);async function J(){const e=document.getElementById("app");e.innerHTML="",e.appendChild(T()),u.use(async t=>{if(!["/login","/"].includes(t))try{if(!await m.getCurrentUser())return u.navigate("/login"),!1}catch{return u.navigate("/login"),!1}return!0}),u.register("/",C),u.register("/login",C),u.register("/home",B),u.register("/products",N),u.register("/help",H),u.register("/profile",U),window.addEventListener("languageChange",()=>{F();const t=u.getCurrentRoute();t&&u.navigate(t)});try{const t=await m.getCurrentUser();setTimeout(()=>{t?u.navigate("/home"):u.navigate("/login")},1500)}catch{setTimeout(()=>{u.navigate("/login")},1500)}}J();
