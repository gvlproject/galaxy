define("mvc/workflow/workflow-node",["exports","utils/utils","mvc/workflow/workflow-view-node"],function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(e),a=n(o),s=Backbone.Model.extend({initialize:function(t,e){this.app=t,this.element=e.element,this.input_terminals={},this.output_terminals={},this.errors={},this.workflow_outputs=[]},getWorkflowOutput:function(t){return _.findWhere(this.workflow_outputs,{output_name:t})},isWorkflowOutput:function(t){return void 0!==this.getWorkflowOutput(t)},removeWorkflowOutput:function(t){for(;this.isWorkflowOutput(t);)this.workflow_outputs.splice(this.getWorkflowOutput(t),1)},addWorkflowOutput:function(t,e){if(!this.isWorkflowOutput(t)){var o={output_name:t};return e&&(o.label=e),this.workflow_outputs.push(o),!0}return!1},labelWorkflowOutput:function(t,e){var o=!1,n=null;if(this.isWorkflowOutput(t)){var i=this.getWorkflowOutput(t);n=i.label,i.label=e,o=n!=e}else o=this.addWorkflowOutput(t,e);return o&&(this.app.workflow.updateOutputLabel(n,e),this.markChanged(),this.nodeView.redrawWorkflowOutputs()),o},connectedOutputTerminals:function(){return this._connectedTerminals(this.output_terminals)},_connectedTerminals:function(t){var e=[];return $.each(t,function(t,o){o.connectors.length>0&&e.push(o)}),e},hasConnectedOutputTerminals:function(){var t=this.output_terminals;for(var e in t)if(t[e].connectors.length>0)return!0;return!1},connectedMappedInputTerminals:function(){return this._connectedMappedTerminals(this.input_terminals)},hasConnectedMappedInputTerminals:function(){var t=this.input_terminals;for(var e in t){var o=t[e];if(o.connectors.length>0&&o.isMappedOver())return!0}return!1},_connectedMappedTerminals:function(t){var e=[];return $.each(t,function(t,o){o.mapOver().isCollection&&o.connectors.length>0&&e.push(o)}),e},mappedInputTerminals:function(){return this._mappedTerminals(this.input_terminals)},_mappedTerminals:function(t){var e=[];return $.each(t,function(t,o){o.mapOver().isCollection&&e.push(o)}),e},hasMappedOverInputTerminals:function(){var t=!1;return _.each(this.input_terminals,function(e){e.mapOver().isCollection&&(t=!0)}),t},redraw:function(){$.each(this.input_terminals,function(t,e){e.redraw()}),$.each(this.output_terminals,function(t,e){e.redraw()})},clone:function(){var t=this,e={name:this.name,label:this.label,annotation:this.annotation,post_job_actions:this.post_job_actions},o=this.app.workflow.create_node(this.type,this.name,this.content_id);i.default.request({type:"POST",url:Galaxy.root+"api/workflows/build_module",data:{type:this.type,tool_id:this.content_id,inputs:this.tool_state},success:function(n){var i=Object.assign({},n,e);o.init_field_data(i),o.update_field_data(i),t.app.workflow.activate_node(o)}})},destroy:function(){$.each(this.input_terminals,function(t,e){e.destroy()}),$.each(this.output_terminals,function(t,e){e.destroy()}),this.app.workflow.remove_node(this),$(this.element).remove()},make_active:function(){$(this.element).addClass("toolForm-active")},make_inactive:function(){var t=this.element.get(0);!function(e){e.removeChild(t),e.appendChild(t)}(t.parentNode),$(t).removeClass("toolForm-active")},init_field_data:function(t){t.type&&(this.type=t.type),this.name=t.name,this.config_form=t.config_form,this.tool_version=this.config_form&&this.config_form.version,this.tool_state=t.tool_state,this.errors=t.errors,this.tooltip=t.tooltip?t.tooltip:"",this.annotation=t.annotation,this.post_job_actions=t.post_job_actions?t.post_job_actions:{},this.label=t.label,this.uuid=t.uuid,this.workflow_outputs=t.workflow_outputs?t.workflow_outputs:[];var e=this,o=new a.default({el:this.element[0],node:e});e.nodeView=o,$.each(t.data_inputs,function(t,e){o.addDataInput(e)}),t.data_inputs.length>0&&t.data_outputs.length>0&&o.addRule(),$.each(t.data_outputs,function(t,e){o.addDataOutput(e)}),o.render(),this.app.workflow.node_changed(this,!0)},update_field_data:function(t){var e=this,o=e.nodeView,n=[];if($.each(o.outputViews,function(e,o){var i=o.output.name,a=t.data_outputs,s=!1;_.each(a,function(t){t.name==i&&(s=!0)}),!1===s&&n.push(i)}),_.each(n,function(t){_.each(o.outputViews[t].terminalElement.terminal.connectors,function(t){t&&t.destroy()}),o.outputViews[t].remove(),delete o.outputViews[t],delete e.output_terminals[t]}),$.each(e.workflow_outputs,function(t,o){o&&!e.output_terminals[o.output_name]&&e.workflow_outputs.splice(t,1)}),$.each(t.data_outputs,function(t,n){o.outputViews[n.name]?(e.output_terminals[n.name].datatypes=n.extensions,e.output_terminals[n.name].destroyInvalidConnections()):o.addDataOutput(n)}),this.tool_state=t.tool_state,this.config_form=t.config_form,this.tool_version=this.config_form&&this.config_form.version,this.errors=t.errors,this.annotation=t.annotation,this.label=t.label,"post_job_actions"in t){var i=t.post_job_actions;this.post_job_actions=i||{}}e.nodeView.renderToolErrors();var a=o.$("div.inputs"),s=o.newInputsDiv(),u={};_.each(t.data_inputs,function(t){var o=e.nodeView.addDataInput(t,s);u[t.name]=o}),_.each(_.difference(_.values(o.terminalViews),_.values(u)),function(t){t.el.terminal.destroy()}),o.terminalViews=u,e.nodeView.render(),1==t.data_outputs.length&&"collection_type"in t.data_outputs[0]&&o.updateDataOutput(t.data_outputs[0]),a.replaceWith(s),"workflow_outputs"in t&&(this.workflow_outputs=t.workflow_outputs?t.workflow_outputs:[]),this.markChanged(),this.redraw()},error:function(t){var e=$(this.element).find(".toolFormBody");e.find("div").remove();var o="<div style='color: red; text-style: italic;'>"+t+"</div>";this.config_form=o,e.html(o),this.app.workflow.node_changed(this)},markChanged:function(){this.app.workflow.node_changed(this)}});t.default=s});